import { useEffect, useState } from 'react'

export default function useGeoCoding (coordinates) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.1.2:3000/getStreetNames', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(coordinates),
        })

        const data = await response.json();

        console.log(data)

        if (response.ok) {

          setResult(data);
        } else {
          console.error('Error:', data.error || 'Unknown error');
          setResult(null);
        }
      } catch (error) {
        console.error('Error:', error.message);
        setResult(null);
      }
    };

    if (coordinates) {
      fetchData();
    }
  }, [coordinates]);

  return {
    result,
  };
};

