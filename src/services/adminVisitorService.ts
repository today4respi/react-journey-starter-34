
import axios from 'axios';

const API_BASE_URL = 'https://www.respizenmedical.com/mylittle/api';

export interface Visitor {
  id: string;
  ip_address: string;
  page_visited: string;
  referrer?: string;
  user_agent: string;
  city?: string;
  country?: string;
  visit_date: string;
  session_id: string;
}

export interface VisitorStats {
  total_visits: number;
  unique_sessions: number;
  unique_visitors: number;
  unique_countries: number;
  today_visits: number;
}

export interface VisitorPagination {
  total: number;
  limit: number;
  offset: number;
  page: number;
  total_pages: number;
}

export interface VisitorResponse {
  status: string;
  data: {
    visitors: Visitor[];
    pagination: VisitorPagination;
    stats: VisitorStats;
  };
  message?: string;
}

export const fetchVisitors = async (params: {
  limit?: number;
  offset?: number;
  page?: number;
  pageFilter?: string;
}): Promise<VisitorResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageFilter) queryParams.append('page', params.pageFilter);

    const response = await axios.get(`${API_BASE_URL}/get_visitors.php?${queryParams}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching visitors:', error);
    throw new Error('Failed to fetch visitor data');
  }
};
