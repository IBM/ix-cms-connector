const mockData = {
  name: "Yavin IV",
  rotation_period: "24",
  orbital_period: "4818",
  diameter: "10200",
  climate: "temperate, tropical",
  gravity: "1 standard",
  terrain: "jungle, rainforests",
  surface_water: "8",
  population: "1000",
  residents: [],
};

const axios = () => {
  return new Promise((resolve) => {
    resolve({ data: mockData });
  });
};

export default axios;
