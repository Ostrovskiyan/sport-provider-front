const url = `${process.env.BACKEND_URL}/usr-srv`

export const userService = {
  async getProfile() {
    return (await fetch(`${url}/profile`)).json();
  }
}