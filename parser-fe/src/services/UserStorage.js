class UserStorage {
  static getAuthStatus() {
    return !!localStorage.getItem('authUser');
  };

  static setAuthStatus(value) {
    localStorage.setItem('authUser', value);
  };

  static logout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  }
}

export default UserStorage;
