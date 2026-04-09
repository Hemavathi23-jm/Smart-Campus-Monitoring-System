import json
import boto3

table = boto3.resource('dynamodb').Table('sensor_data')

def lambda_handler(event, context):
    print("EVENT:", event)
    try:
        # Get all items
        response = table.scan()
        items = response.get('Items', [])

        if not items:
            return {
                "statusCode": 404,
                "body": json.dumps("No data found")
            }

        # Filter valid data
        valid_items = [
            i for i in items
            if i.get("ph") is not None and i.get("moisture") is not None
        ]

        if not valid_items:
            return {
                "statusCode": 404,
                "body": json.dumps("No valid data")
            }

        # Calculate report
        total = len(valid_items)
        avg_ph = sum(float(i["ph"]) for i in valid_items) / total
        avg_moisture = sum(float(i["moisture"]) for i in valid_items) / total

        return {
            "statusCode": 200,
            "body": json.dumps({
                "total_records": total,
                "average_ph": round(avg_ph, 2),
                "average_moisture": round(avg_moisture, 2)
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }