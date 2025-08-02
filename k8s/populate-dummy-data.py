import uuid
import mysql.connector
import time
import datetime

time.sleep(10)  # Wait for MySQL to be ready
conn = mysql.connector.connect(host='mysql', port=3306, user='root', password='password', database='intelecta_db')
cur = conn.cursor()

def safe_execute(sql, params):
    try:
        cur.execute(sql, params)
    except Exception as e:
        print(f"Error executing: {sql} with params {params}\nError: {e}")

# Clean and repopulate referenced tables with valid UUIDs
for table in ['user_progress', 'test', 'exercises', 'chapters', 'users', 'subject', 'user_progres', 'user', 'chapter_user_finished', 'chapter_user_started', 'class_user', 'exercise_steps', 'refresh_token', 'user_chapter_last_error_times', 'user_chapter_strikes']:
    try:
        cur.execute(f"TRUNCATE TABLE {table}")
    except Exception:
        pass

# Repopulate subject (binary(16) id)
subject_ids_bin = [uuid.uuid4().bytes for _ in range(3)]
subject_ids_str = [str(uuid.UUID(bytes=sid)) for sid in subject_ids_bin]
for i, sid in enumerate(subject_ids_bin):
    safe_execute("INSERT INTO subject (id, name) VALUES (%s, %s)", (sid, f'Subject {i+1}'))

# Repopulate chapters (binary(16) id, subject_id)
chapter_ids_bin = [uuid.uuid4().bytes for _ in range(3)]
chapter_ids_str = [str(uuid.UUID(bytes=cid)) for cid in chapter_ids_bin]
for i, cid in enumerate(chapter_ids_bin):
    safe_execute("INSERT INTO chapters (id, name, subject_id) VALUES (%s, %s, %s)", (cid, f'Chapter {i+1}', subject_ids_bin[i % len(subject_ids_bin)]))

# Repopulate users (binary(16) id)
user_ids_bin = [uuid.uuid4().bytes for _ in range(3)]
user_ids_str = [str(uuid.UUID(bytes=uid)) for uid in user_ids_bin]
for i, uid in enumerate(user_ids_bin):
    safe_execute("INSERT INTO users (id, email, first_name, last_name, password, role) VALUES (%s, %s, %s, %s, %s, %s)", (uid, f'user{i+1}@example.com', f'First{i+1}', f'Last{i+1}', 'password', 'student'))

# Repopulate exercises (binary(16) id, chapterId, content, answer, points, type)
exercise_ids_bin = [uuid.uuid4().bytes for _ in range(3)]
exercise_ids_str = [str(uuid.UUID(bytes=eid)) for eid in exercise_ids_bin]
for i, eid in enumerate(exercise_ids_bin):
    safe_execute("INSERT INTO exercises (id, chapterId, content, answer, points, type) VALUES (%s, %s, %s, %s, %s, %s)", (eid, chapter_ids_bin[i % len(chapter_ids_bin)], f'Content {i+1}', f'Answer {i+1}', 10, 'type1'))

# Repopulate class_user (binary(16) id)
class_user_ids = [uuid.uuid4().bytes for _ in range(3)]
for i, cid in enumerate(class_user_ids):
    safe_execute("INSERT INTO class_user (id, class_number, profil) VALUES (%s, %s, %s)", (cid, i+1, f'Profile {i+1}'))

# Insert test data (char(36) id, subject_id)
test_ids = [str(uuid.uuid4()) for _ in range(5)]
for i, test_id in enumerate(test_ids):
    subject_id = subject_ids_str[i % len(subject_ids_str)]
    grades = 10 - i
    test_type = ['midterm', 'final', 'quiz', 'midterm', 'quiz'][i]
    test_ans_type = ['multiple', 'open', 'multiple', 'open', 'multiple'][i]
    safe_execute("INSERT INTO test (id, grades, subject_id, test_type, test_ans_type) VALUES (%s, %s, %s, %s, %s)", (test_id, grades, subject_id, test_type, test_ans_type))

# Insert user_progress dummy data (char(36) id, user_id, chapter_id, exercise_id)
for i in range(10):
    up_id = str(uuid.uuid4())
    user_id = user_ids_str[i % len(user_ids_str)]
    chapter_id = chapter_ids_str[i % len(chapter_ids_str)]
    exercise_id = exercise_ids_str[i % len(exercise_ids_str)]
    safe_execute("INSERT INTO user_progress (id, user_id, chapter_id, exercise_id) VALUES (%s, %s, %s, %s)", (up_id, user_id, chapter_id, exercise_id))

# Insert dummy data into user (char(36) id, required fields)
user_table_ids = [str(uuid.uuid4()) for _ in range(3)]
for i, uid in enumerate(user_table_ids):
    safe_execute("INSERT INTO user (id, first_name, last_name, email, password, role) VALUES (%s, %s, %s, %s, %s, %s)", (uid, f'First{i+1}', f'Last{i+1}', f'user{i+1}@example.com', 'password', 'student'))

# Insert dummy data into user_progres (binary(16) id, chapter_id, exercice_id, user_id)
for i in range(3):
    up_id = uuid.uuid4().bytes
    chapter_id = chapter_ids_bin[i % len(chapter_ids_bin)]
    exercise_id = exercise_ids_bin[i % len(exercise_ids_bin)]
    user_id = user_ids_bin[i % len(user_ids_bin)]
    safe_execute("INSERT INTO user_progres (id, date, chapter_id, exercice_id, user_id) VALUES (%s, %s, %s, %s, %s)", (up_id, datetime.datetime.now(), chapter_id, exercise_id, user_id))

# Insert at least one row into all other empty tables with required fields and valid references
# chapter_user_finished (binary(16) chapter_id, user_id)
safe_execute("INSERT INTO chapter_user_finished (chapter_id, user_id) VALUES (%s, %s)", (chapter_ids_bin[0], user_ids_bin[0]))
# chapter_user_started (binary(16) chapter_id, user_id)
safe_execute("INSERT INTO chapter_user_started (chapter_id, user_id) VALUES (%s, %s)", (chapter_ids_bin[1], user_ids_bin[1]))
# exercise_steps (binary(16) exercise_id)
safe_execute("INSERT INTO exercise_steps (exercise_id, step_content) VALUES (%s, %s)", (exercise_ids_bin[0], 'Step 1'))
# refresh_token (binary(16) id, user_id)
safe_execute("INSERT INTO refresh_token (id, expiry_date, token, user_id) VALUES (%s, %s, %s, %s)", (uuid.uuid4().bytes, datetime.datetime.now(), 'token', user_ids_bin[0]))
# user_chapter_last_error_times (binary(16) user_id, last_error_times_key)
safe_execute("INSERT INTO user_chapter_last_error_times (user_id, last_error_time, last_error_times_key) VALUES (%s, %s, %s)", (user_ids_bin[0], datetime.datetime.now(), uuid.uuid4().bytes))
# user_chapter_strikes (binary(16) user_id, chapter_strike_counts_key)
safe_execute("INSERT INTO user_chapter_strikes (user_id, strike_count, chapter_strike_counts_key) VALUES (%s, %s, %s)", (user_ids_bin[0], 1, uuid.uuid4().bytes))

conn.commit()
cur.close()
conn.close()
print('Dummy data inserted successfully.') 