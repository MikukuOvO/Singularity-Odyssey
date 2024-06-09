import sqlite3
import uuid
from datetime import datetime
from zhipuai import ZhipuAI
import json
import re

# 初始化数据库
def init_db():
    with sqlite3.connect('events.db') as conn:
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                title TEXT,
                start TEXT,
                end TEXT,
                description TEXT,
            )
        ''')
        conn.commit()

# 添加事件到数据库
def add_event(title, start, end, destination):
    event_id = str(uuid.uuid4())  # 生成唯一事件ID
    with sqlite3.connect('events.db') as conn:
        conn.execute('''
            INSERT INTO events (id, title, start, end, destination)
            VALUES (?, ?, ?, ?, ?)
        ''', (event_id, title, start, end, destination))
    print(f"Event '{title}' added with ID {event_id}")

# 创建ZhipuAI客户端实例
client = ZhipuAI(api_key="8f80e67f4dfe3665b2d92f959b0467e5.CQnbYZvzG0NLGdmv")  # 使用环境变量或安全方式加载API密钥

def checkifactions(content):
    response = client.chat.completions.create(
        model="glm-4",  # 填写需要调用的模型名称
        messages=[
            {"role": "system",
             "content": "请根据用户的语言判断用户是想要进行日历操作还是想要聊天，如果是日历操作请返回0，否则请返回1"},
            {"role": "user", "content": "今天晚上8点和同学一起吃饭"},
            {"role": "assistant", "content": "0"},
            {"role": "user", "content": "晚上安排一个会议"},
            {"role": "assistant", "content": "0"},
            {"role": "user", "content": "晚上跟小汪去KTV"},
            {"role": "assistant", "content": "0"},
            {"role": "user", "content": "今天天气真好"},
            {"role": "assistant", "content": "1"},
            {"role": "user", "content": "我好累"},
            {"role": "assistant", "content": "1"},
            {"role": "user", "content": "我想吃饭，你有什么推荐嘛"},
            {"role": "assistant", "content": "1"},
            {"role": "user", "content": content}
        ],
    )
    choice = response.choices[0].message.content
    print(choice)
    return choice

def talk(content):
    response = client.chat.completions.create(
        model="glm-4",  # 填写需要调用的模型名称
        messages=[
            {"role": "system",
             "content": "请活泼的跟用户进行聊天"},
            {"role": "user", "content": content}
        ],
    )

    print(response.choices[0].message)
    msg = response.choices[0].message.content
    return msg

# 解析用户输入的自然语言，获取事件的时间和名称
def get_event_details_from_model(user_input):
    current_date = datetime.now().strftime('%Y-%m-%d %H:%M')
    response = client.chat.completions.create(
        model="glm-4",  # 填写需要调用的模型名称
        messages=[
            {"role": "system",
             "content": "你是一个日历助手的组件，你的任务是通过用户的自然语言来分析用户期望事件发生的时间，你需要按照标准格式返回时间"},
            {"role": "system", "content": "如果信息不全，你需要通过用户的自然语言来解析，根据当前的日期来推测事件的日期"},
            {"role": "system", "content": f"当前的日期是{current_date}"},
            {"role": "system", "content": f"你需要将返回的日期结果包括在$$$ $$$之内，比如$$$ 2000-1-1 8:00~9:00$$$"},
            {"role": "system", "content": "你的返回的格式必须是 年-月-日 起始时间~结束时间"},
            {"role": "user", "content": "今天晚上8点和同学一起吃饭"},
            {"role": "assistant", "content": f"$$${current_date} 20:00~21:00$$$"},
            {"role": "user", "content": "4月25号早上9点上编译原理课程"},
            {"role": "assistant", "content": "$$$2024-4-25 9:00~10:00$$$"},
            {"role": "user", "content": "年底在老家吃饭"},
            {"role": "assistant", "content": "$$$2024-12-31 8:00~9:00$$$"},
            {"role": "user", "content": user_input}
        ],
    )
    print(response.choices[0].message)
    pattern = r"\$\$\$(\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{2}~\d{1,2}:\d{2})\$\$\$"
    print(response.choices[0].message.content)
    time_range = re.search(pattern, response.choices[0].message.content).group(1)

    response = client.chat.completions.create(
        model="glm-4",  # 填写需要调用的模型名称
        messages=[
            {"role": "system",
             "content": "你是一个日历助手的组件，你的任务是通过用户的自然语言来分析推断用户期望的事件名称"},
            {"role": "system", "content": "你的返回中不要带有任何和时间和事件的地点相关的内容，如果去掉后句子不通顺，请根据你的理解补全，去掉标点符号"},
            {"role": "user", "content": "今天晚上8点和同学一起吃饭"},
            {"role": "assistant", "content": "和同学一起吃饭"},
            {"role": "user", "content": "4月25号早上9点上编译原理课程"},
            {"role": "assistant", "content": "编译原理课程"},
            {"role": "user", "content": "我困了"},
            {"role": "assistant", "content": "睡觉"},
            {"role": "user", "content": user_input}
        ],
    )

    print(response.choices[0].message)
    name = response.choices[0].message.content

    response = client.chat.completions.create(
        model="glm-4",  # 填写需要调用的模型名称
        messages=[
            {"role": "system",
             "content": "你是一个日历助手的组件，你的任务是通过用户的自然语言来分析用户期望的事件的地点，你需要返回一句自然语言"},
            {"role": "system", "content": "你的返回中不要带有任何和时间或者名称相关的内容，如果你觉得用户没有提及，请根据你的理解补全，去掉标点符号"},
            {"role": "user", "content": "今天晚上8点和同学一起吃饭"},
            {"role": "assistant", "content": "食堂"},
            {"role": "user", "content": "4月25号早上9点教五上编译原理课程"},
            {"role": "assistant", "content": "教五"},
            {"role": "user", "content": "4月29号晚上去湖边散步"},
            {"role": "assistant", "content": "湖边"},
            {"role": "user", "content": user_input}
        ],
    )

    print(response.choices[0].message)
    destination = response.choices[0].message.content

    return name, time_range, destination

def action(content):

    # 示例：处理用户输入
    # user_input = input("Please enter your event details: ")
    user_input = content
    event_name, time_range, destination = get_event_details_from_model(user_input)
    start_time_str, end_time_str = time_range.split('~')
    start_time = datetime.strptime(start_time_str, '%Y-%m-%d %H:%M')
    end_time = datetime.strptime(end_time_str, '%H:%M').time()
    end_time = datetime.combine(start_time.date(), end_time)

    # 添加事件到数据库
    add_event(event_name, start_time.isoformat(), end_time.isoformat(), destination)
    return "Add Events Successfully!"

def get_talk(content):
    if checkifactions(content) == '0':
        return action(content)
    else:
        return talk(content)


def get_summary(events):
    # Generate a summary from the list of events
    response = client.chat.completions.create(
        model="glm-4",  # Fill in the model name you need to call
        messages=[
            {"role": "system",
             "content": "你是一个日历助手，你的任务是生成分离的单独的关键实质性名次，如时间的名称和地点，以及人物，不需要包括那些笼统的词，比如“地方”、“具体时间”，用逗号隔开，包括用户提供的所有事件的主要内容"},
            {"role": "user", "content": f"这些是我的事件: {json.dumps(events)}"},
        ],
    )

    summary = response.choices[0].message.content
    return summary