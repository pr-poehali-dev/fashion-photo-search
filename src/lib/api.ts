// API endpoints from backend functions
const API_URLS = {
  fashionSearch: 'https://functions.poehali.dev/ae958169-a240-49c4-82fb-b7aa1dace58d',
  virtualTryon: 'https://functions.poehali.dev/17910f06-60fb-4d82-b85e-8544ff4e2d63',
};

export interface SearchResult {
  name: string;
  brand: string;
  price: number;
  currency: string;
  image_url: string;
  product_url: string;
  match_score: number;
}

export interface SearchResponse {
  searchId: number;
  results: SearchResult[];
  imageUrl: string;
}

export interface TryonResponse {
  tryonId: number;
  personImageUrl: string;
  clothesImageUrl: string;
  resultImageUrl: string;
  status: string;
}

// Mock user ID for demo (в реальном приложении будет из авторизации)
const MOCK_USER_ID = '1';

export async function searchFashion(imageBase64: string, clothingType?: string): Promise<SearchResponse> {
  const response = await fetch(API_URLS.fashionSearch, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': MOCK_USER_ID,
    },
    body: JSON.stringify({
      image: imageBase64,
      clothingType: clothingType || '',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Search failed');
  }

  return response.json();
}

export async function virtualTryon(personImageBase64: string, clothesImageBase64: string): Promise<TryonResponse> {
  const response = await fetch(API_URLS.virtualTryon, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': MOCK_USER_ID,
    },
    body: JSON.stringify({
      personImage: personImageBase64,
      clothesImage: clothesImageBase64,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Virtual try-on failed');
  }

  return response.json();
}
