
export interface ChildData {
  name: string;
  age: string;
  message: string;
  photoUrl: string;
  photo?: File;
  objective: string;
}

export interface FormData {
  childCount: number;
  children: ChildData[];
  planType?: string;
  orderData?: any;
}

export const localStorageService = {
  // Save form data
  saveFormData(data: Partial<FormData>) {
    const existing = this.getFormData();
    const updated = { ...existing, ...data };
    localStorage.setItem('mylittle_form_data', JSON.stringify(updated));
  },

  // Get form data
  getFormData(): FormData {
    const data = localStorage.getItem('mylittle_form_data');
    return data ? JSON.parse(data) : {
      childCount: 1,
      children: []
    };
  },

  // Clear form data
  clearFormData() {
    localStorage.removeItem('mylittle_form_data');
  },

  // Save child data specifically
  saveChildrenData(children: ChildData[]) {
    this.saveFormData({ children });
  },

  // Get children data
  getChildrenData(): ChildData[] {
    return this.getFormData().children || [];
  }
};
