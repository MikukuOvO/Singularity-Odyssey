import sqlite3


def init_db(reset=False):
    conn = sqlite3.connect('events.db')
    c = conn.cursor()

    if reset:
        c.execute('DROP TABLE IF EXISTS events')  # Delete the table if it exists

    # Create the table as new
    c.execute('''
        CREATE TABLE events (
            id TEXT PRIMARY KEY,
            title TEXT,
            start TEXT,
            end TEXT,
            destination TEXT
        )
    ''')
    conn.commit()
    conn.close()


# To initialize the database or reset it, you can now call:
init_db(reset=True)  # This will reset the entire database and recreate the table
