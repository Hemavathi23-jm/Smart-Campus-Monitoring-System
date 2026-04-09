import json
import boto3

# Connect to DynamoDB
table = boto3.resource('dynamodb').Table('sensor_data')

def lambda_handler(event, context):
    print("EVENT:", event)
    try:
        # Get latest items
        response = table.scan(Limit=10)
        items = response.get('Items', [])

        if not items:
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps("No data found")
            }

        # Sort latest by timestamp
        latest_item = sorted(
            items,
            key=lambda x: x.get("timestamp", ""),
            reverse=True
        )[0]

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": json.dumps(latest_item, default=float)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": str(e)})
        }