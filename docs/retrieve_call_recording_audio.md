# Retrieve Call Recording Audio File

## Step 1 - Fetch calls

```bash
curl --request GET --url https://api.centrixcc.com/accounts/<account id>/calls \
  --header 'Content-Type: application/json'
  --header 'Authorization: Bearer <token>'
```

## Step 2 - Fetch call recordings

```bash
curl --request GET --url https://api.centrixcc.com/accounts/<account id>/calls/recordings \
  --header 'Content-Type: application/json'
  --header 'Authorization: Bearer <token>'
```

## Step 3 - Fetch call recording audio file

You can change .mp3 for .wav to get the audio in a different format.

```bash
curl --request GET --url https://api.centrixcc.com/accounts/<account id>/recordings<recording id>.mp3 -o \
  --header 'Content-Type: application/json'
  --header 'Authorization: Bearer <token>'
```