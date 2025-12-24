import os
import django
import psycopg2

# الاتصال المباشر بـ PostgreSQL
try:
    # احصل على DATABASE_URL من متغيرات البيئة
    db_url = os.environ.get('DATABASE_URL')
    
    if not db_url:
        print("❌ DATABASE_URL environment variable not set")
        exit(1)
    
    # تحويل URL إلى معاملات الاتصال
    from urllib.parse import urlparse
    parsed = urlparse(db_url)
    
    conn = psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path.lstrip('/'),
        user=parsed.username,
        password=parsed.password
    )
    
    cursor = conn.cursor()
    
    # عرض المستخدمين الحاليين
    cursor.execute("SELECT id, username, email FROM auth_user;")
    users = cursor.fetchall()
    
    print("📋 المستخدمون الحاليون:")
    for user_id, username, email in users:
        print(f"  - ID: {user_id}, Username: {username}, Email: {email}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ خطأ في الاتصال: {e}")
