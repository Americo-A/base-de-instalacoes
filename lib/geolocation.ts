export async function obterEndereco(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não disponível neste navegador'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Usando serviço de geocodificação reversa (OpenStreetMap Nominatim)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'Controle-Instalacoes-App',
              },
            }
          )

          if (!response.ok) {
            throw new Error('Erro ao obter endereço')
          }

          const data = await response.json()
          const endereco = data.address?.road || data.address?.pedestrian || data.address?.path || data.display_name
          resolve(endereco || `${latitude}, ${longitude}`)
        } catch (error) {
          // Se falhar, retorna as coordenadas
          resolve(`${latitude}, ${longitude}`)
        }
      },
      (error) => {
        reject(new Error(`Erro ao obter localização: ${error.message}`))
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  })
}
