const API_URL = "";

export default class Backend {
  static call(method, params, retry = 5) {
    return new Promise((resolve, reject) => {
      fetch(`${API_URL}/${method}`, params)
        .then((r) => r.json())
        .then((r) => {
          if (!r.ok) reject(r.error);
          resolve(r);
        })
        .catch((e) => {
          if (e instanceof TypeError && retry > 1) {
            // Network error
            setTimeout(() => {
              Backend.request(method, params, retry - 1)
                .then(resolve)
                .catch(reject);
            }, Math.random() * 1000);
          } else {
            reject(e);
          }
        });
    });
  }
}
