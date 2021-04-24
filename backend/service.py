from datetime import datetime
from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
import psycopg2
import psycopg2.extras
import redis

app = Flask(__name__)
CORS(app, allow_headers='*',
     origins='*',  supports_credentials=True)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response

def pgconnection():
    return psycopg2.connect("dbname=kiwi user=kiwi host=postgres")
    # return psycopg2.connect("dbname=kiwi user=kiwi")


def redisconnection():
    return redis.Redis(host='redis', port=6379, db=0, decode_responses=True)
    # return redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)


@app.route("/getdoors")
def getdoors():
    conn = pgconnection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    rd = redisconnection()
    # rd.set_response_callback('GET',float)
    cur.execute(
        "SELECT *,doors.id as doorid FROM doors INNER JOIN addresses ON doors.address_id=addresses.id")
    records = []
    for row in cur.fetchall():
        temp_row = row
        last_opening_time = rd.get(f"last_opening_ts:{row['sensor_uuid']}")
        last_communication_time = rd.get(
            f"last_communication_ts:{row['sensor_uuid']}")
        try:
            temp_row['last_opening_time'] = datetime.utcfromtimestamp(
                int(float(last_opening_time)))
        except Exception as ex:
            temp_row['last_upd_time'] = None
        try:
            temp_row['last_communication_time'] = datetime.utcfromtimestamp(
                int(float(last_communication_time)))
        except Exception as ex:
            temp_row['last_communication_time'] = None
        records.append(temp_row)
    conn.close()

    print(rd.get("last_opening_ts:f7b82615a8ed4dbfab37c433d9fc0a95"))
    return jsonify(records)


@app.route("/getdoorusers/<doorid>")
def getdoorusers(doorid):
    conn = pgconnection()
    rd = redisconnection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM user_door_permissions per INNER JOIN users u ON per.user_id=u.id WHERE per.door_id={doorid}")
    users = [dict(row) for row in cur.fetchall()]
    cur.execute(
        f"SELECT * FROM doors INNER JOIN addresses ON doors.address_id=addresses.id WHERE doors.id={doorid}")
    door = cur.fetchall()[0]
    last_opening_time = rd.get(f"last_opening_ts:{door['sensor_uuid']}")
    last_communication_time = rd.get(
        f"last_communication_ts:{door['sensor_uuid']}")
    try:
        door['last_opening_time'] = datetime.utcfromtimestamp(
            int(float(last_opening_time)))
    except Exception as ex:
        door['last_upd_time'] = None
    try:
        door['last_communication_time'] = datetime.utcfromtimestamp(
            int(float(last_communication_time)))
    except Exception as ex:
        door['last_communication_time'] = None
    door['users'] = users
    conn.close()
    return jsonify(door)


@app.route("/getusers/<doorid>")
def getusers(doorid):
    conn = pgconnection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM user_door_permissions WHERE door_id={doorid})")
    users = [dict(row) for row in cur.fetchall()]
    return jsonify(users)


@app.route("/adddooruser", methods=['POST'])
def adddooruser():
    params = request.get_json()
    conn = pgconnection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"INSERT INTO user_door_permissions(user_id,door_id,creation_time) VALUES(%s,%s,current_timestamp) RETURNING id", (params['user_id'], params['door_id']))
    records = [dict(row) for row in cur.fetchall()]
    conn.commit()
    conn.close()
    return jsonify(records)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
