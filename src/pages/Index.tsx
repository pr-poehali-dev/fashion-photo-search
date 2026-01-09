import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Index = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'search' | 'tryon' | 'results' | 'profile'>('home');
  const [searchImage, setSearchImage] = useState<string | null>(null);
  const [tryonClothes, setTryonClothes] = useState<string | null>(null);
  const [tryonPerson, setTryonPerson] = useState<string | null>(null);
  const [clothingType, setClothingType] = useState<string>('');

  const mockResults = [
    { id: 1, name: 'Шелковая блуза', brand: 'CHANEL', price: '89 990 ₽', image: '/placeholder.svg', match: '98%' },
    { id: 2, name: 'Атласная рубашка', brand: 'DIOR', price: '75 990 ₽', image: '/placeholder.svg', match: '95%' },
    { id: 3, name: 'Классическая блуза', brand: 'GUCCI', price: '62 990 ₽', image: '/placeholder.svg', match: '92%' },
    { id: 4, name: 'Элегантная блузка', brand: 'VALENTINO', price: '54 990 ₽', image: '/placeholder.svg', match: '90%' },
  ];

  const history = [
    { id: 1, type: 'Поиск', date: '08.01.2026', status: 'Найдено 12 товаров' },
    { id: 2, type: 'Примерка', date: '07.01.2026', status: 'Успешно' },
    { id: 3, type: 'Поиск', date: '05.01.2026', status: 'Найдено 8 товаров' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'search' | 'clothes' | 'person') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'search') setSearchImage(result);
        else if (type === 'clothes') setTryonClothes(result);
        else if (type === 'person') setTryonPerson(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">LUXE VISION</h1>
            <div className="flex gap-8">
              <button
                onClick={() => setActiveSection('home')}
                className={`text-sm tracking-wide transition-colors ${activeSection === 'home' ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}`}
              >
                Главная
              </button>
              <button
                onClick={() => setActiveSection('search')}
                className={`text-sm tracking-wide transition-colors ${activeSection === 'search' ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}`}
              >
                Поиск
              </button>
              <button
                onClick={() => setActiveSection('tryon')}
                className={`text-sm tracking-wide transition-colors ${activeSection === 'tryon' ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}`}
              >
                Примерка
              </button>
              <button
                onClick={() => setActiveSection('profile')}
                className={`text-sm tracking-wide transition-colors ${activeSection === 'profile' ? 'text-black font-medium' : 'text-gray-500 hover:text-black'}`}
              >
                Профиль
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {activeSection === 'home' && (
          <div className="animate-fade-in">
            <section className="container mx-auto px-6 py-24 text-center">
              <h2 className="text-7xl font-light mb-6 leading-tight">
                Найдите идеальную
                <br />
                <span className="italic">вещь</span>
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light">
                AI-технологии для поиска одежды по фото и виртуальной примерки.
                Премиум качество. Мгновенные результаты.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-base"
                  onClick={() => setActiveSection('search')}
                >
                  Начать поиск
                  <Icon name="Search" className="ml-2" size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-black text-black hover:bg-gray-50 px-8 py-6 text-base"
                  onClick={() => setActiveSection('tryon')}
                >
                  Примерить
                  <Icon name="Sparkles" className="ml-2" size={20} />
                </Button>
              </div>
            </section>

            <section className="bg-gray-50 py-20">
              <div className="container mx-auto px-6">
                <h3 className="text-4xl font-light text-center mb-16">Возможности</h3>
                <div className="grid md:grid-cols-3 gap-12">
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="Search" size={28} className="text-accent" />
                      </div>
                      <h4 className="text-2xl mb-4">Умный поиск</h4>
                      <p className="text-gray-600 font-light">
                        Загрузите фото — найдем точное совпадение среди тысяч брендов
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="Sparkles" size={28} className="text-accent" />
                      </div>
                      <h4 className="text-2xl mb-4">AI-примерка</h4>
                      <p className="text-gray-600 font-light">
                        Посмотрите, как вещь сидит на вас, не выходя из дома
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="Zap" size={28} className="text-accent" />
                      </div>
                      <h4 className="text-2xl mb-4">Мгновенно</h4>
                      <p className="text-gray-600 font-light">
                        Результаты за секунды. Высокая точность распознавания
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'search' && (
          <div className="container mx-auto px-6 py-12 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl font-light mb-4 text-center">Поиск по фото</h2>
              <p className="text-gray-600 text-center mb-12">
                Загрузите изображение вещи, и мы найдем её в лучших магазинах мира
              </p>

              <Card className="border-2 border-dashed border-gray-300 hover:border-accent transition-colors">
                <CardContent className="p-12">
                  <div className="text-center">
                    {!searchImage ? (
                      <>
                        <Icon name="Upload" size={48} className="mx-auto mb-6 text-gray-400" />
                        <Label htmlFor="search-upload" className="cursor-pointer">
                          <div className="text-xl mb-2">Нажмите для загрузки</div>
                          <div className="text-sm text-gray-500 mb-6">
                            PNG, JPG до 10MB
                          </div>
                          <Button className="bg-black hover:bg-gray-800">
                            Выбрать файл
                          </Button>
                        </Label>
                        <Input
                          id="search-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'search')}
                        />
                      </>
                    ) : (
                      <div className="space-y-6">
                        <img
                          src={searchImage}
                          alt="Uploaded"
                          className="max-h-96 mx-auto rounded-lg shadow-lg"
                        />
                        <div className="flex gap-4 justify-center">
                          <Button
                            size="lg"
                            className="bg-black hover:bg-gray-800"
                            onClick={() => setActiveSection('results')}
                          >
                            Найти вещь
                            <Icon name="Search" className="ml-2" size={20} />
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setSearchImage(null)}
                          >
                            Загрузить другое фото
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'tryon' && (
          <div className="container mx-auto px-6 py-12 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-5xl font-light mb-4 text-center">AI-примерка</h2>
              <p className="text-gray-600 text-center mb-12">
                Загрузите фото одежды и своё фото, чтобы увидеть, как вещь будет на вас сидеть
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card className="border-2 border-dashed border-gray-300 hover:border-accent transition-colors">
                  <CardContent className="p-8">
                    <h3 className="text-xl mb-6 text-center">Фото одежды</h3>
                    {!tryonClothes ? (
                      <div className="text-center">
                        <Icon name="Shirt" size={40} className="mx-auto mb-4 text-gray-400" />
                        <Label htmlFor="clothes-upload" className="cursor-pointer">
                          <Button variant="outline" className="mb-2">
                            Загрузить фото
                          </Button>
                        </Label>
                        <Input
                          id="clothes-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'clothes')}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <img
                          src={tryonClothes}
                          alt="Clothes"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setTryonClothes(null)}
                        >
                          Заменить
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-300 hover:border-accent transition-colors">
                  <CardContent className="p-8">
                    <h3 className="text-xl mb-6 text-center">Ваше фото</h3>
                    {!tryonPerson ? (
                      <div className="text-center">
                        <Icon name="User" size={40} className="mx-auto mb-4 text-gray-400" />
                        <Label htmlFor="person-upload" className="cursor-pointer">
                          <Button variant="outline" className="mb-2">
                            Загрузить фото
                          </Button>
                        </Label>
                        <Input
                          id="person-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'person')}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <img
                          src={tryonPerson}
                          alt="Person"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setTryonPerson(null)}
                        >
                          Заменить
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-8">
                <CardContent className="p-6">
                  <Label className="text-base mb-3 block">Тип одежды</Label>
                  <Select value={clothingType} onValueChange={setClothingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип одежды" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hat">Головной убор</SelectItem>
                      <SelectItem value="top">Туловище</SelectItem>
                      <SelectItem value="bottom">Ноги</SelectItem>
                      <SelectItem value="shoes">Обувь</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-800 px-12"
                  disabled={!tryonClothes || !tryonPerson || !clothingType}
                >
                  Примерить
                  <Icon name="Sparkles" className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'results' && (
          <div className="container mx-auto px-6 py-12 animate-fade-in">
            <div className="mb-12 text-center">
              <h2 className="text-5xl font-light mb-4">Результаты поиска</h2>
              <p className="text-gray-600">Найдено {mockResults.length} похожих товара</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {mockResults.map((item) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 right-4 bg-accent text-black border-0">
                        {item.match}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <div className="text-xs tracking-wider text-gray-500 mb-2">
                        {item.brand}
                      </div>
                      <h3 className="text-lg mb-3 font-medium">{item.name}</h3>
                      <div className="text-xl font-light">{item.price}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setActiveSection('search')}
              >
                Новый поиск
                <Icon name="Search" className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="container mx-auto px-6 py-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-light mb-12 text-center">Профиль</h2>

              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-12">
                  <TabsTrigger value="history">История</TabsTrigger>
                  <TabsTrigger value="settings">Настройки</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="space-y-4">
                  {history.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                            <Icon
                              name={item.type === 'Поиск' ? 'Search' : 'Sparkles'}
                              size={20}
                              className="text-accent"
                            />
                          </div>
                          <div>
                            <div className="font-medium mb-1">{item.type}</div>
                            <div className="text-sm text-gray-500">{item.date}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{item.status}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl mb-6">Управление дизайном</h3>
                      <p className="text-gray-600 mb-4">
                        Здесь вы сможете настроить цветовую схему, шрифты и размещение рекламных блоков
                      </p>
                      <Button variant="outline">Открыть редактор</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl mb-6">Рекламные блоки</h3>
                      <p className="text-gray-600 mb-4">
                        Управляйте размещением и содержанием рекламы на сайте
                      </p>
                      <Button variant="outline">Настроить рекламу</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-black text-white py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-light mb-4">LUXE VISION</h3>
          <p className="text-gray-400 font-light">
            AI-сервис поиска одежды премиум класса
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
