import json
import os
import base64
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''
    API для поиска одежды по фотографии
    
    Принимает фото в base64, сохраняет в S3, ищет похожие товары
    и возвращает результаты с процентом совпадения
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
        image_base64 = body.get('image')
        clothing_type = body.get('clothingType', '')
        user_id = event.get('headers', {}).get('x-user-id')
        
        if not image_base64:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Image is required'}),
                'isBase64Encoded': False
            }
        
        # Сохраняем изображение в S3
        import boto3
        
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        # Декодируем base64
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        image_data = base64.b64decode(image_base64)
        
        # Генерируем уникальное имя файла
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_key = f'searches/{timestamp}.jpg'
        
        # Загружаем в S3
        s3.put_object(
            Bucket='files',
            Key=file_key,
            Body=image_data,
            ContentType='image/jpeg'
        )
        
        # URL изображения
        image_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
        
        # Подключаемся к БД
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        
        # Сохраняем историю поиска
        cur.execute(
            "INSERT INTO search_history (user_id, image_url, clothing_type) VALUES (%s, %s, %s) RETURNING id",
            (user_id, image_url, clothing_type)
        )
        search_id = cur.fetchone()[0]
        
        # Имитация AI-поиска (в реальности здесь будет API внешнего сервиса)
        mock_results = [
            {
                'name': 'Шелковая блуза',
                'brand': 'CHANEL',
                'price': 89990.0,
                'currency': 'RUB',
                'image_url': 'https://via.placeholder.com/400x500/FFE5E5/000000?text=CHANEL',
                'product_url': 'https://example.com/product1',
                'match_score': 98.0
            },
            {
                'name': 'Атласная рубашка',
                'brand': 'DIOR',
                'price': 75990.0,
                'currency': 'RUB',
                'image_url': 'https://via.placeholder.com/400x500/E5F0FF/000000?text=DIOR',
                'product_url': 'https://example.com/product2',
                'match_score': 95.0
            },
            {
                'name': 'Классическая блуза',
                'brand': 'GUCCI',
                'price': 62990.0,
                'currency': 'RUB',
                'image_url': 'https://via.placeholder.com/400x500/E5FFE5/000000?text=GUCCI',
                'product_url': 'https://example.com/product3',
                'match_score': 92.0
            },
            {
                'name': 'Элегантная блузка',
                'brand': 'VALENTINO',
                'price': 54990.0,
                'currency': 'RUB',
                'image_url': 'https://via.placeholder.com/400x500/FFF5E5/000000?text=VALENTINO',
                'product_url': 'https://example.com/product4',
                'match_score': 90.0
            }
        ]
        
        # Сохраняем результаты в БД
        for product in mock_results:
            cur.execute(
                """INSERT INTO products 
                   (name, brand, price, currency, image_url, product_url, match_score, search_id)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (product['name'], product['brand'], product['price'], product['currency'],
                 product['image_url'], product['product_url'], product['match_score'], search_id)
            )
        
        # Обновляем счетчик результатов
        cur.execute(
            "UPDATE search_history SET results_count = %s WHERE id = %s",
            (len(mock_results), search_id)
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'searchId': search_id,
                'results': mock_results,
                'imageUrl': image_url
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
