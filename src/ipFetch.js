const URL = 'https://api.ipify.org/?format=json'

export const getMyIP = async () => {
  try{
    const response = await fetch(URL)
    if(!response.ok){
      throw new Error("Não foi possivel fazer a requisição")
    }

    return response.json()
  }
  catch({title,message}){
    alert(title,message)
  }
}

