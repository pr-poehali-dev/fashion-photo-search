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
import { searchFashion, virtualTryon, SearchResult } from '@/lib/api';
import { toast } from 'sonner';

const Index = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'search' | 'tryon' | 'results' | 'profile'>('home');
  const [searchImage, setSearchImage] = useState<string | null>(null);
  const [tryonClothes, setTryonClothes] = useState<string | null>(null);
  const [tryonPerson, setTryonPerson] = useState<string | null>(null);
  const [clothingType, setClothingType] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [tryonResult, setTryonResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [theme, setTheme] = useState({
    bgColor: 'bg-white',
    textColor: 'text-black',
    accentColor: 'bg-black',
    font: 'Roboto',
    logoPosition: 'left',
    cardSize: 'medium',
  });
  
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [heroBanner, setHeroBanner] = useState<string | null>(null);
  
  const [texts, setTexts] = useState({
    heroTitle: 'Найдите идеальную вещь',
    heroSubtitle: 'AI-технологии для поиска одежды по фото и виртуальной примерки',
    searchButton: 'Начать поиск',
    tryonButton: 'Примерить',
  });

  const handleSearch = async () => {
    if (!searchImage) {
      toast.error('Загрузите фото для поиска');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await searchFashion(searchImage, clothingType);
      setSearchResults(response.results);
      setActiveSection('results');
      toast.success(`Найдено ${response.results.length} товаров`);
    } catch (error) {
      toast.error('Ошибка поиска: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryon = async () => {
    if (!tryonPerson || !tryonClothes) {
      toast.error('Загрузите оба фото для примерки');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await virtualTryon(tryonPerson, tryonClothes);
      setTryonResult(response.resultImageUrl);
      toast.success('Примерка готова!');
    } catch (error) {
      toast.error('Ошибка примерки: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const history = [
    { id: 1, type: 'Поиск', date: '08.01.2026', status: 'Найдено 12 товаров' },
    { id: 2, type: 'Примерка', date: '07.01.2026', status: 'Успешно' },
    { id: 3, type: 'Поиск', date: '05.01.2026', status: 'Найдено 8 товаров' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'search' | 'clothes' | 'person' | 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'search') setSearchImage(result);
        else if (type === 'clothes') setTryonClothes(result);
        else if (type === 'person') setTryonPerson(result);
        else if (type === 'logo') setCustomLogo(result);
        else if (type === 'banner') setHeroBanner(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cardSizeClasses = {
    small: 'h-64',
    medium: 'h-80',
    large: 'h-96',
  };

  return (
    <div className={`min-h-screen ${theme.bgColor} transition-colors duration-300`}>
      <nav className={`fixed top-0 w-full ${theme.bgColor}/95 backdrop-blur-sm border-b border-gray-200 z-50 transition-colors duration-300`}>
        <div className="container mx-auto px-6 py-4">
          <div className={`flex items-center ${theme.logoPosition === 'center' ? 'justify-center' : theme.logoPosition === 'right' ? 'justify-end' : 'justify-between'}`}>
            {customLogo ? (
              <img src={customLogo} alt="Logo" className="h-12 object-contain" />
            ) : (
              <h1 className={`text-2xl font-light tracking-[0.2em] ${theme.textColor}`} style={{ fontFamily: theme.font }}>LUX ATELIER</h1>
            )}
            {theme.logoPosition !== 'center' && theme.logoPosition !== 'right' && (
            <div className="flex gap-8">
              <button
                onClick={() => setActiveSection('home')}
                className={`text-xs uppercase tracking-[0.15em] transition-colors font-light ${activeSection === 'home' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Главная
              </button>
              <button
                onClick={() => setActiveSection('search')}
                className={`text-xs uppercase tracking-[0.15em] transition-colors font-light ${activeSection === 'search' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Поиск
              </button>
              <button
                onClick={() => setActiveSection('tryon')}
                className={`text-xs uppercase tracking-[0.15em] transition-colors font-light ${activeSection === 'tryon' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Примерка
              </button>
              <button
                onClick={() => setActiveSection('profile')}
                className={`text-xs uppercase tracking-[0.15em] transition-colors font-light ${activeSection === 'profile' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Профиль
              </button>
            </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {activeSection === 'home' && (
          <div className="animate-fade-in">
            {heroBanner && (
              <div className="w-full mb-12">
                <img src={heroBanner} alt="Hero Banner" className="w-full h-96 object-cover" />
              </div>
            )}
            <section className="container mx-auto px-6 py-24 text-center">
              <h2 className="text-6xl md:text-7xl font-light mb-8 leading-tight tracking-wide uppercase">
                {texts.heroTitle}
              </h2>
              <p className="text-base text-gray-500 mb-12 max-w-2xl mx-auto font-light tracking-wide">
                {texts.heroSubtitle}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 px-10 py-6 text-xs uppercase tracking-[0.15em] font-light"
                  onClick={() => setActiveSection('search')}
                >
                  {texts.searchButton}
                  <Icon name="Search" className="ml-2" size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-black text-black hover:bg-gray-50 px-10 py-6 text-xs uppercase tracking-[0.15em] font-light"
                  onClick={() => setActiveSection('tryon')}
                >
                  {texts.tryonButton}
                  <Icon name="Sparkles" className="ml-2" size={20} />
                </Button>
              </div>
            </section>

            <section className="bg-gray-50 py-20">
              <div className="container mx-auto px-6">
                <h3 className="text-3xl font-light text-center mb-16 uppercase tracking-[0.15em]">Возможности</h3>
                <div className="grid md:grid-cols-3 gap-12">
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="Search" size={28} className="text-accent" />
                      </div>
                      <h4 className="text-lg mb-4 uppercase tracking-wide font-light">Умный поиск</h4>
                      <p className="text-sm text-gray-500 font-light leading-relaxed">
                        Загрузите фото — найдем точное совпадение среди тысяч брендов
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="Sparkles" size={28} className="text-accent" />
                      </div>
                      <h4 className="text-lg mb-4 uppercase tracking-wide font-light">AI-примерка</h4>
                      <p className="text-sm text-gray-500 font-light leading-relaxed">
                        Посмотрите, как вещь сидит на вас, не выходя из дома
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="Zap" size={28} className="text-accent" />
                      </div>
                      <h4 className="text-lg mb-4 uppercase tracking-wide font-light">Мгновенно</h4>
                      <p className="text-sm text-gray-500 font-light leading-relaxed">
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
              <h2 className="text-4xl font-light mb-4 text-center uppercase tracking-[0.15em]">Поиск по фото</h2>
              <p className="text-sm text-gray-500 text-center mb-12 tracking-wide">
                Загрузите изображение вещи, и мы найдем её в лучших магазинах мира
              </p>

              <Card className="border-2 border-dashed border-gray-300 hover:border-accent transition-colors">
                <CardContent className="p-12">
                  <div className="text-center">
                    {!searchImage ? (
                      <>
                        <Icon name="Upload" size={48} className="mx-auto mb-6 text-gray-400" />
                        <div className="text-base mb-2 font-light tracking-wide">Нажмите для загрузки</div>
                        <div className="text-xs text-gray-500 mb-6 tracking-wide">
                          PNG, JPG до 10MB
                        </div>
                        <Label 
                          htmlFor="search-upload" 
                          className="cursor-pointer inline-block bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-md uppercase text-xs tracking-[0.15em] font-light transition-colors"
                        >
                          Выбрать файл
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
                            className="bg-black hover:bg-gray-800 uppercase text-xs tracking-[0.15em] font-light"
                            onClick={handleSearch}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Ищем...' : 'Найти вещь'}
                            <Icon name="Search" className="ml-2" size={20} />
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setSearchImage(null)}
                            disabled={isLoading}
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
              <h2 className="text-4xl font-light mb-4 text-center uppercase tracking-[0.15em]">AI-примерка</h2>
              <p className="text-sm text-gray-500 text-center mb-12 tracking-wide">
                Загрузите фото одежды и своё фото, чтобы увидеть, как вещь будет на вас сидеть
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card className="border-2 border-dashed border-gray-300 hover:border-accent transition-colors">
                  <CardContent className="p-8">
                    <h3 className="text-sm mb-6 text-center uppercase tracking-[0.15em] font-light">Фото одежды</h3>
                    {!tryonClothes ? (
                      <div className="text-center">
                        <Icon name="Shirt" size={40} className="mx-auto mb-4 text-gray-400" />
                        <Label 
                          htmlFor="clothes-upload" 
                          className="cursor-pointer inline-block border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Загрузить фото
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
                    <h3 className="text-sm mb-6 text-center uppercase tracking-[0.15em] font-light">Ваше фото</h3>
                    {!tryonPerson ? (
                      <div className="text-center">
                        <Icon name="User" size={40} className="mx-auto mb-4 text-gray-400" />
                        <Label 
                          htmlFor="person-upload" 
                          className="cursor-pointer inline-block border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Загрузить фото
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
                  <Label className="text-xs mb-3 block uppercase tracking-[0.15em] font-light">Тип одежды</Label>
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
                  className="bg-black hover:bg-gray-800 px-12 uppercase text-xs tracking-[0.15em] font-light"
                  disabled={!tryonClothes || !tryonPerson || isLoading}
                  onClick={handleTryon}
                >
                  {isLoading ? 'Обрабатываем...' : 'Примерить'}
                  <Icon name="Sparkles" className="ml-2" size={20} />
                </Button>
              </div>
              
              {tryonResult && (
                <Card className="mt-8">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-light mb-6 text-center uppercase tracking-[0.15em]">Результат примерки</h3>
                    <img
                      src={tryonResult}
                      alt="Try-on Result"
                      className="max-h-[600px] mx-auto rounded-lg shadow-lg"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeSection === 'results' && (
          <div className="container mx-auto px-6 py-12 animate-fade-in">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-light mb-4 uppercase tracking-[0.15em]">Результаты поиска</h2>
              <p className="text-sm text-gray-500 tracking-wide">Найдено {searchResults.length} похожих товара</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {searchResults.map((item, index) => (
                <Card
                  key={index}
                  className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className={`w-full ${cardSizeClasses[theme.cardSize as keyof typeof cardSizeClasses]} object-cover group-hover:scale-105 transition-transform duration-300`}
                      />
                      <Badge className="absolute top-4 right-4 bg-accent text-black border-0">
                        {item.match_score}%
                      </Badge>
                    </div>
                    <div className="p-6">
                      <div className="text-xs tracking-[0.15em] text-gray-400 mb-2 uppercase">
                        {item.brand}
                      </div>
                      <h3 className="text-sm mb-3 font-light">{item.name}</h3>
                      <div className="text-base font-light">{item.price.toLocaleString('ru-RU')} {item.currency}</div>
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
              <h2 className="text-4xl font-light mb-12 text-center uppercase tracking-[0.15em]">Профиль</h2>

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
                      <h3 className="text-base mb-6 uppercase tracking-[0.15em] font-light">Конструктор сайта</h3>
                      <div className="space-y-4 mb-6">
                        <div className="border-b pb-4">
                          <Label className="text-xs uppercase tracking-[0.15em] font-light mb-3 block">Цветовая схема</Label>
                          <div className="grid grid-cols-5 gap-3">
                            <div 
                              className={`w-full h-12 bg-white border-2 ${theme.bgColor === 'bg-white' ? 'border-black ring-2 ring-black' : 'border-gray-300'} rounded cursor-pointer hover:scale-105 transition-transform`}
                              title="Белый"
                              onClick={() => setTheme({ ...theme, bgColor: 'bg-white', textColor: 'text-black', accentColor: 'bg-black' })}
                            ></div>
                            <div 
                              className={`w-full h-12 bg-gray-900 border-2 ${theme.bgColor === 'bg-gray-900' ? 'border-white ring-2 ring-white' : 'border-gray-700'} rounded cursor-pointer hover:scale-105 transition-transform`}
                              title="Черный"
                              onClick={() => setTheme({ ...theme, bgColor: 'bg-gray-900', textColor: 'text-white', accentColor: 'bg-white' })}
                            ></div>
                            <div 
                              className={`w-full h-12 bg-gray-100 border-2 ${theme.bgColor === 'bg-gray-100' ? 'border-gray-400 ring-2 ring-gray-400' : 'border-gray-300'} rounded cursor-pointer hover:scale-105 transition-transform`}
                              title="Серый"
                              onClick={() => setTheme({ ...theme, bgColor: 'bg-gray-100', textColor: 'text-gray-900', accentColor: 'bg-gray-900' })}
                            ></div>
                            <div 
                              className={`w-full h-12 bg-blue-50 border-2 ${theme.bgColor === 'bg-blue-50' ? 'border-blue-400 ring-2 ring-blue-400' : 'border-blue-200'} rounded cursor-pointer hover:scale-105 transition-transform`}
                              title="Голубой"
                              onClick={() => setTheme({ ...theme, bgColor: 'bg-blue-50', textColor: 'text-blue-900', accentColor: 'bg-blue-600' })}
                            ></div>
                            <div 
                              className={`w-full h-12 bg-pink-50 border-2 ${theme.bgColor === 'bg-pink-50' ? 'border-pink-400 ring-2 ring-pink-400' : 'border-pink-200'} rounded cursor-pointer hover:scale-105 transition-transform`}
                              title="Розовый"
                              onClick={() => setTheme({ ...theme, bgColor: 'bg-pink-50', textColor: 'text-pink-900', accentColor: 'bg-pink-600' })}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="border-b pb-4">
                          <Label className="text-xs uppercase tracking-[0.15em] font-light mb-3 block">Шрифт заголовков</Label>
                          <Select value={theme.font} onValueChange={(value) => setTheme({ ...theme, font: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Roboto">Roboto Light</SelectItem>
                              <SelectItem value="Montserrat">Montserrat</SelectItem>
                              <SelectItem value="Cormorant">Cormorant</SelectItem>
                              <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="border-b pb-4">
                          <Label className="text-xs uppercase tracking-[0.15em] font-light mb-3 block">Расположение логотипа</Label>
                          <div className="grid grid-cols-3 gap-3">
                            <Button 
                              variant={theme.logoPosition === 'left' ? 'default' : 'outline'}
                              size="sm" 
                              className="text-xs"
                              onClick={() => setTheme({ ...theme, logoPosition: 'left' })}
                            >
                              Слева
                            </Button>
                            <Button 
                              variant={theme.logoPosition === 'center' ? 'default' : 'outline'}
                              size="sm" 
                              className="text-xs"
                              onClick={() => setTheme({ ...theme, logoPosition: 'center' })}
                            >
                              Центр
                            </Button>
                            <Button 
                              variant={theme.logoPosition === 'right' ? 'default' : 'outline'}
                              size="sm" 
                              className="text-xs"
                              onClick={() => setTheme({ ...theme, logoPosition: 'right' })}
                            >
                              Справа
                            </Button>
                          </div>
                        </div>

                        <div className="border-b pb-4">
                          <Label className="text-xs uppercase tracking-[0.15em] font-light mb-3 block">Размер карточек товаров</Label>
                          <div className="grid grid-cols-3 gap-3">
                            <Button 
                              variant={theme.cardSize === 'small' ? 'default' : 'outline'}
                              size="sm" 
                              className="text-xs"
                              onClick={() => setTheme({ ...theme, cardSize: 'small' })}
                            >
                              Маленький
                            </Button>
                            <Button 
                              variant={theme.cardSize === 'medium' ? 'default' : 'outline'}
                              size="sm" 
                              className="text-xs"
                              onClick={() => setTheme({ ...theme, cardSize: 'medium' })}
                            >
                              Средний
                            </Button>
                            <Button 
                              variant={theme.cardSize === 'large' ? 'default' : 'outline'}
                              size="sm" 
                              className="text-xs"
                              onClick={() => setTheme({ ...theme, cardSize: 'large' })}
                            >
                              Большой
                            </Button>
                          </div>
                        </div>

                        <div className="border-b pb-4">
                          <Label className="text-xs uppercase tracking-[0.15em] font-light mb-3 block">Свой логотип</Label>
                          {customLogo ? (
                            <div className="space-y-3">
                              <img src={customLogo} alt="Custom Logo" className="h-16 object-contain mx-auto" />
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs"
                                onClick={() => setCustomLogo(null)}
                              >
                                Удалить логотип
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Label htmlFor="logo-upload" className="cursor-pointer block">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent transition-colors">
                                  <Icon name="ImagePlus" size={28} className="mx-auto mb-2 text-gray-400" />
                                  <p className="text-xs text-gray-500 mb-1">Загрузить логотип</p>
                                  <p className="text-xs text-gray-400">PNG с прозрачным фоном</p>
                                </div>
                              </Label>
                              <Input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, 'logo')}
                              />
                            </>
                          )}
                        </div>

                        <div>
                          <Label className="text-xs uppercase tracking-[0.15em] font-light mb-3 block">Рекламный баннер</Label>
                          {heroBanner ? (
                            <div className="space-y-3">
                              <img src={heroBanner} alt="Hero Banner" className="w-full h-32 object-cover rounded-lg" />
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs"
                                onClick={() => setHeroBanner(null)}
                              >
                                Удалить баннер
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Label htmlFor="banner-upload" className="cursor-pointer block">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-accent transition-colors">
                                  <Icon name="ImagePlus" size={32} className="mx-auto mb-3 text-gray-400" />
                                  <p className="text-xs text-gray-500 mb-2">Загрузить баннер для главной страницы</p>
                                  <p className="text-xs text-gray-400">1920×400 px, JPG или PNG</p>
                                </div>
                              </Label>
                              <Input
                                id="banner-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, 'banner')}
                              />
                            </>
                          )}
                        </div>

                        <div className="border-t pt-4 mt-4">
                          <Label className="text-xs uppercase tracking-[0.15em] font-light mb-4 block">Тексты главной страницы</Label>
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">Заголовок</Label>
                              <Input 
                                value={texts.heroTitle}
                                onChange={(e) => setTexts({ ...texts, heroTitle: e.target.value })}
                                className="text-sm"
                                placeholder="Найдите идеальную вещь"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">Подзаголовок</Label>
                              <Input 
                                value={texts.heroSubtitle}
                                onChange={(e) => setTexts({ ...texts, heroSubtitle: e.target.value })}
                                className="text-sm"
                                placeholder="AI-технологии для поиска одежды"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-gray-500 mb-1 block">Кнопка 1</Label>
                                <Input 
                                  value={texts.searchButton}
                                  onChange={(e) => setTexts({ ...texts, searchButton: e.target.value })}
                                  className="text-sm"
                                  placeholder="Начать поиск"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500 mb-1 block">Кнопка 2</Label>
                                <Input 
                                  value={texts.tryonButton}
                                  onChange={(e) => setTexts({ ...texts, tryonButton: e.target.value })}
                                  className="text-sm"
                                  placeholder="Примерить"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-black hover:bg-gray-800 uppercase text-xs tracking-[0.15em]">
                        Сохранить изменения
                      </Button>
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
          <h3 className="text-xl font-light mb-4 tracking-[0.2em]">LUX ATELIER</h3>
          <p className="text-xs text-gray-400 font-light tracking-wide uppercase">
            AI-сервис поиска одежды премиум класса
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;