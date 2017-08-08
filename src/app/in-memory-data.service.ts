import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let routes = [
      {Id: 1, Name:  'Route 1', City: 'Des Moines', CreatedDate: '07/10/2017', IsActive: true },
      {Id: 2, Name:  'Route 2', City: 'Des Moines', CreatedDate: '07/10/2017', IsActive: true },
      {Id: 3, Name:  'Route 3', City: 'Des Moines', CreatedDate: '07/10/2017', IsActive: true },
      {Id: 4, Name:  'Route 4', City: 'Des Moines', CreatedDate: '07/10/2017', IsActive: true },
      {Id: 5, Name:  'Route 5', City: 'Des Moines', CreatedDate: '07/10/2017', IsActive: true },
      {Id: 6, Name:  'Route 6', City: 'Des Moines', CreatedDate: '07/10/2017', IsActive: true },
      {Id: 7, Name:  'Route 7', City: 'Des Moines', CreatedDate: '07/10/2017', IsActive: true },
      {Id: 8, Name:  'Route 8', City: 'Des Moines', CreatedDate: '07/10/2017', IsActive: true }
    ];
    let hunts = [
      {id: 1, date: '11/21/2017', location: 'Lake Sugema', temperature: 38, windDirection: 'NW', windSpeed: 12, shotsFired: 23, gunUsed: 'Stoeger', dog: 'Shep', retrieves: 4},
      {id: 2, date: '11/20/2017', location: 'Lake Sugema', temperature: 42, windDirection: 'NNW', windSpeed: 1, shotsFired: 32, gunUsed: 'Stoeger', dog: 'Shep', retrieves: 8},
      {id: 3, date: '11/12/2017', location: 'Sudan Bottoms', temperature: 39, windDirection: 'N', windSpeed: 8, shotsFired: 30, gunUsed: 'Stoeger', dog: 'N/A', retrieves: 0},
      {id: 4, date: '11/11/2017', location: 'Lake Sugema', temperature: 43, windDirection: 'W', windSpeed: 10, shotsFired: 42, gunUsed: 'Stoeger', dog: 'N/A', retrieves: 0},
      {id: 5, date: '11/03/2017', location: 'Sweets Marsh', temperature: 45, windDirection: 'SW', windSpeed: 13, shotsFired: 21, gunUsed: 'Stoeger', dog: 'Shep', retrieves: 7},
      {id: 6, date: '11/02/2017', location: 'Sudan Bottoms', temperature: 43, windDirection: 'NW', windSpeed: 4, shotsFired: 27, gunUsed: 'Stoeger', dog: 'Sarah', retrieves: 4},
      {id: 7, date: '11/01/2017', location: 'Verl Jacksons', temperature: 48, windDirection: 'WNW', windSpeed: 7, shotsFired: 38, gunUsed: 'Stoeger', dog: 'Ellie', retrieves: 9},
      {id: 8, date: '10/24/2017', location: 'Lake Sugema', temperature: 54, windDirection: 'NW', windSpeed: 9, shotsFired: 14, gunUsed: 'Stoeger', dog: 'Ellie', retrieves: 2},
      {id: 9, date: '10/23/2017', location: 'Lake Sugema', temperature: 58, windDirection: 'N', windSpeed: 12, shotsFired: 23, gunUsed: 'Stoeger', dog: 'Ellie', retrieves: 3}
    ];
    
    let huntPartners = [
      { id: 1, name: 'Kevin'},
      { id: 1, name: 'Jesse'},
      { id: 2, name: 'Fats'},
      { id: 2, name: 'Will'},
      { id: 3, name: 'Kevin'},
      { id: 3, name: 'Will'},
      { id: 3, name: 'Fats'},
      { id: 3, name: 'Jesse'},
      { id: 4, name: 'Kevin'},
      { id: 4, name: 'Jesse'},
      { id: 4, name: 'Keegan'},
      { id: 4, name: 'Corey'},
      { id: 5, name: 'John Wayne'},
      { id: 5, name: 'Will'},
      { id: 6, name: 'Kevin'},
      { id: 6, name: 'Will'},
      { id: 6, name: 'Fats'},
      { id: 6, name: 'Jesse'},
      { id: 6, name: 'Jim'},
      { id: 6, name: 'Mike'},
      { id: 7, name: 'Kevin'},
      { id: 7, name: 'Jesse'},
      { id: 9, name: 'Kevin'},
      { id: 9, name: 'Will'},
      { id: 9, name: 'Fats'},
      { id: 9, name: 'Jesse'}
    ];

    let heroes = [
      {id: 11, name: 'Mr. Nice'},
      {id: 12, name: 'Narco'},
      {id: 13, name: 'Bombasto'},
      {id: 14, name: 'Celeritas'},
      {id: 15, name: 'Magneta'},
      {id: 16, name: 'RubberMan'},
      {id: 17, name: 'Dynama'},
      {id: 18, name: 'Dr IQ'},
      {id: 19, name: 'Magma'},
      {id: 20, name: 'Tornado'}
    ];

    let shotDucks = [
      { id: 1, species: 'mallard', drake: 3, hen: 0 },
      { id: 1, species: 'green-wing teal', drake: 4, hen: 1 },
      { id: 2, species: 'shoveler', drake: 1 },
      { id: 2, species: 'pintail', drake: 2, hen: 1 },
      { id: 3, species: 'mallard', drake: 8, hen: 1 },
      { id: 3, species: 'pintail', drake: 1, hen: 0 },
      { id: 3, species: 'green-wing teal', drake: 2, hen: 2 },
      { id: 3, species: 'gadwall', drake: 1, hen: 0 },
      { id: 4, species: 'mallard', drake: 2, hen: 1 },
      { id: 5, species: 'mallard', drake: 3, hen: 0 },
      { id: 5, species: 'shoveler', drake: 0, hen: 1 },
      { id: 5, species: 'blue-wing teal', drake: 1, hen: 1},
      { id: 6, species: 'blue-wing teal', drake: 3, hen: 2},
      { id: 6, species: 'wood duck', drake: 2, hen: 1 },
      { id: 6, species: 'merganzer', drake: 1, hen: 0 },
      { id: 7, species: 'wood duck', drake: 3, hen: 1 },
      { id: 7, species: 'blue-wing teal', drake: 2, hen: 0},
      { id: 8, species: 'blue-wing teal', drake: 2, hen: 2 },
      { id: 9, species: 'blue-wing teal', drake: 4, hen: 2 },
      { id: 9, species: 'wood duck', drake: 2, hen: 1}
    ]
    return {routes, hunts, huntPartners, heroes, shotDucks};
  };
}
