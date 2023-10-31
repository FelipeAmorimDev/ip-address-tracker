const ApiKEY = 'at_p8iPyG9jHowVt5AxiLjGN6uFndZdR'
const baseURL = 'https://geo.ipify.org/api/v2/'

export const getIpData = async (ip = "177.204.213.108") => {
  try{
    const URL = `${baseURL}country,city?apiKey=${ApiKEY}&ipAddress=${ip}`
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

