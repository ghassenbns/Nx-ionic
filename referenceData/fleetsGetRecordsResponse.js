
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

fetch("http://localhost/mobility/fleets/records?filters%5B0%5D%5Bscope%5D=owner_details.name&filters%5B0%5D%5Boperator%5D=like&filters%5B0%5D%5Bvalue%5D=admin&filters%5B0%5D%5Btype%5D=string&paginate%5Bpage%5D=1&paginate%5Blength%5D=10&paginate%5Bfrom%5D=0", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

/**
 *  example payload of the response of /fleets endpoint
 *
 */
let fleetsGetRecordsResponse = {
  "status": "ok",
  "pagination":
  {
    "from": 1,
    "to": 11,
    "total": 30,
    "current_page": 2,
    "per_page": 10,
    "last_page": 3,
    // sent by laravel but not used
    // "next_page_url": null,
    // "prev_page_url": "http://localhost/mobility/fleets/records?fields%5B0%5D=_id&fields%5B1%5D=name&fields%5B2%5D=description&fields%5B3%5D=owner_details&fields%5B4%5D=is_active&paginate%5Bpage%5D=1&paginate%5Blength%5D=10&paginate%5Bfrom%5D=0&length=10&page=1",
  },
  "data": [
    {
      "_id": "6419d3f4588af1f5eb025668",
      "name": "fleet 0",
      "description": "created by superAdmin",
      "is_active": true,
      "owner_id": 1,
      "owner_details":
      {
        "id": 1,
        "name": "superAdmin"
      }
    },
    {
      "_id": "6419d3f4588af1f5eb025669",
      "name": "fleet 1",
      "description": "created by superAdmin",
      "is_active": true,
      "owner_id": 1,
      "owner_details":
      {
        "id": 1,
        "name": "superAdmin"
      }
    },
    {
      "_id": "6419d3f4588af1f5eb02566a",
      "name": "fleet 2",
      "description": "created by superAdmin",
      "is_active": true,
      "owner_id": 1,
      "owner_details":
      {
        "id": 1,
        "name": "superAdmin"
      }
    },
    {
      "_id": "6419d3f4588af1f5eb02566b",
      "name": "fleet 3",
      "description": "created by superAdmin",
      "is_active": true,
      "owner_id": 1,
      "owner_details":
      {
        "id": 1,
        "name": "superAdmin"
      }
    },
    {
      "_id": "6419d3f4588af1f5eb02566c",
      "name": "fleet 4",
      "description": "created by superAdmin",
      "is_active": true,
      "owner_id": 1,
      "owner_details":
      {
        "id": 1,
        "name": "superAdmin"
      }
    },
    {
      "_id": "6419d3f4588af1f5eb02566d",
      "name": "fleet 5",
      "description": "created by superAdmin",
      "is_active": true,
      "owner_id": 1,
      "owner_details":
      {
        "id": 1,
        "name": "superAdmin"
      }
    },
    {
      "_id": "6419d3f4588af1f5eb02566e",
      "name": "fleet 6",
      "description": "created by superAdmin",
      "is_active": true,
      "owner_id": 1,
      "owner_details":
      {
        "id": 1,
        "name": "superAdmin"
      }
    },
    {
      "_id": "6419d3f4588af1f5eb02566f",
      "name": "fleet 7",
      "description": "created by superAdmin",
      "is_active": true,
      "owner_id": 1,
      "owner_details":
      {
        "id": 1,
        "name": "superAdmin"
      }
    },
    {
      "_id": "6419d3f4588af1f5eb025670",
      "name": "fleet 8",
      "description": "created by superAdmin",
      "is_active": true,
      "owner_id": 1,
      "owner_details":
      {
        "id": 1,
        "name": "superAdmin"
      }
    },
    {
      "_id": "6419d3f4588af1f5eb025671",
      "name": "fleet 9",
      "description": "created by superAdmin",
      "is_active": true,
      "owner_id": 1,
      "owner_details":
      {
        "id": 1,
        "name": "superAdmin"
      }
    }]
}
