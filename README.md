# zeal-backend-home

Zeally code assesment

most updated version is on branch `updated`

## Tests
Project is well covered with unit tests, you can run then all by running `npm run test`

## Endpoints
### `/` 
It returns a Healthy message.

### `/health`
Similar to `/`, but It returns an object with ` {status: 'ok', success: true}`

### `/compute`
This is where the logic of the application lives, it requires a Body with the quest and the user params, as follows:
```jsonc
{
  "questId": 
  "userId": "cb413e98-44a4-4bb1-aaa1-0b91ab1707e7", // uuid
  "claimed_at": "2023-03-15T10:44:22+0000", // date in ISO 8601 format
  "access_condition": [ // array of condition object, variable in size
   {
      "type": "nft", //check if a user NFTs contain/notContain a specific ID
      "operator": "contains", //can be "contains" or "notContains"
      "value": "0x1" // Id of the NFT
   },
   {
     "type": "date", // check if the claimed_at date is > or < to the specified value
     "value": "2023-02-15T10:44:22+0000",
     "operator": ">" //can be ">" or "<"
   },
   {
     "type": "level", // check if the user level is > or < to the specified value
     "value": "4", // positive integer
     "operator": ">" // operator can be ">" or "<"
   }
  ],
  "user_data": {
    "completed_quests": [
      "94e2e33e-07e9-4750-8cea-c033d7706057"
    ], // array of uuid
    "nfts": ["Ox1", "0x2"], // array of NFTs ID (hexadecimal)
    "level": 3 // positive integer
  },
  "submission_text": "Lorem ipsum dolor sit amet.", // string
}
```

and then it returns 
```jsonc
status: success | failure
score: integer
```
* status will always failure if score is lower than 5
* user cannot complete a quest he already has
* data is not persisted on DB, just in memory for sake of simplicity
* score will always be zero if there's a bad word such as `f Word | bad | stupid`

### To be implemented
- [ ] Integration with some external api for content moderation, like Google Perspective or WebPurify content filter
