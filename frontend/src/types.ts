export interface Repo {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  category: string;
  readme_snippet: string;
}

export interface CategoryCounts {
  [category: string]: number;
}

export interface ApiResponse {
  repos: Repo[];
  categories: CategoryCounts;
}
