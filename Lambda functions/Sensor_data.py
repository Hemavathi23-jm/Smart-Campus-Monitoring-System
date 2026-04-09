import json
import uuid
from datetime import datetime
import boto3
from decimal import Decimal

table = boto3.resource('dynamodb').Table('sensor_data')

def lambda_handler(event, context):
    print("EVENT:", event)
    try:
        # HANDLE ALL CASES SAFELY
        if isinstance(event, dict):
            if "body" in event and event["body"]:
                body = json.loads(event["body"], parse_float=Decimal)
            else:
                body = event
        else:
            body = {}

        # EXTRACT VALUES SAFELY
        ph = body.get("ph", 0)
        moisture = body.get("moisture", 0)

        # ENSURE Decimal for DynamoDB
        ph = Decimal(str(ph))
        moisture = Decimal(str(moisture))

        item = {
            "id": str(uuid.uuid4()),
            "ph": ph,
            "moisture": moisture,
            "timestamp": datetime.now().isoformat()
        }

        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Data stored successfully"
            })
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e)
            })
        }