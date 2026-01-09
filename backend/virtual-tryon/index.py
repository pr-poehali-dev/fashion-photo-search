import json
import os
import base64
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''
    API для виртуальной примерки одежды
    
    Принимает фото человека и фото одежды в base64,
    сохраняет в S3 и обрабатывает виртуальную примерку
    '''
    
    method = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        # Парсим запрос
        body = json.loads(event.get('body', '{}'))
        person_image = body.get('personImage')
        clothes_image = body.get('clothesImage')
        user_id = event.get('headers', {}).get('x-user-id')
        
        if not person_image or not clothes_image:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Both person and clothes images are required'}),
                'isBase64Encoded': False
            }
        
        # Сохраняем изображения в S3
        import boto3
        
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Декодируем и сохраняем фото человека
        if ',' in person_image:
            person_image = person_image.split(',')[1]
        person_data = base64.b64decode(person_image)
        person_key = f'tryons/person_{timestamp}.jpg'
        
        s3.put_object(
            Bucket='files',
            Key=person_key,
            Body=person_data,
            ContentType='image/jpeg'
        )
        
        person_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{person_key}"
        
        # Декодируем и сохраняем фото одежды
        if ',' in clothes_image:
            clothes_image = clothes_image.split(',')[1]
        clothes_data = base64.b64decode(clothes_image)
        clothes_key = f'tryons/clothes_{timestamp}.jpg'
        
        s3.put_object(
            Bucket='files',
            Key=clothes_key,
            Body=clothes_data,
            ContentType='image/jpeg'
        )
        
        clothes_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{clothes_key}"
        
        # Подключаемся к БД
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        # Имитация результата примерки (в реальности здесь будет AI-обработка)
        # Для демо используем заглушку
        result_url = 'https://via.placeholder.com/400x600/F5F5F5/000000?text=Virtual+Try-On+Result'
        
        # Сохраняем историю примерки
        cur.execute(
            """INSERT INTO tryon_history 
               (user_id, person_image_url, clothes_image_url, result_image_url, status)
               VALUES (%s, %s, %s, %s, %s) RETURNING id""",
            (user_id, person_url, clothes_url, result_url, 'completed')
        )
        tryon_id = cur.fetchone()[0]
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'tryonId': tryon_id,
                'personImageUrl': person_url,
                'clothesImageUrl': clothes_url,
                'resultImageUrl': result_url,
                'status': 'completed'
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
