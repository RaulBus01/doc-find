
export class ApiCall {
   
  static async get(url: string, token: string ) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        if (!response.ok) {
            throw new Error(response.statusText);
            }
            return response.json();
    } catch (error) {
        console.error(error);
        }
    }

    static async post(url: string, token: string, data: any) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data ? JSON.stringify(data) : JSON.stringify({}),
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        } catch (error) {
            console.error(error);
        }
    }

    static async put(url: string, token: string, data: any) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        } catch (error) {
            console.error(error);
        }
    }
}