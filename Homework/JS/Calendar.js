let currDate = new Date();
let currMonth = currDate.getMonth();
let currYear = currDate.getFullYear();
let events = JSON.parse(localStorage.getItem('events')) || [];

//讀取完DOM後才執行JS程式碼
document.addEventListener('DOMContentLoaded', () => {
    
//渲染日歷
    function renderCalendar(month, year) {
        const firstDay = new Date(year, month, 1); 
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate(); //當月總天數
        const startDay = firstDay.getDay(); //星期幾

        const calendarContainer = document.querySelector('#calendar'); //JS渲染日期單元格
        const monthYearElement = document.querySelector('#curr-time'); //JS渲染當前年月
        calendarContainer.innerHTML = ''; //每次渲染前先清空，不清空會重複長整份日歷
        
        //建立標題欄位
        const headerRow = document.createElement('div'); 
        headerRow.className = 'row row-cols-7';
        ['日', '一', '二', '三', '四', '五', '六'].forEach(day => {
            const col = document.createElement('div');
            col.className = 'col border border-black bg-warning fs-3'; 
            col.textContent = day; 
            headerRow.appendChild(col);
        });
        calendarContainer.appendChild(headerRow);

        //建立日期格子
        let currentRow = document.createElement('div');
        currentRow.className = 'row row-cols-7';
        calendarContainer.appendChild(currentRow);

        //生成上個月所佔據的格子
        for (let i = 0; i < startDay; i++) {
            const dayDiv = createDayDiv('', 'text-muted');
            currentRow.appendChild(dayDiv);
        }

        //生成當前月的格子
        for (let date = 1; date <= daysInMonth; date++) {
            if (currentRow.childElementCount === 7) {
                currentRow = document.createElement('div');
                currentRow.className = 'row row-cols-7';
                calendarContainer.appendChild(currentRow);
            }
            const dayDiv = createDayDiv(date);
            currentRow.appendChild(dayDiv);
        }

        //最後一行不足7格時補足
        while (currentRow.childElementCount < 7) {
            const dayDiv = createDayDiv('');
            currentRow.appendChild(dayDiv);
        }

        // 更新年月份
        monthYearElement.textContent = `${year} 年 ${month + 1} 月`;
    }
    
//渲染單元格
    function createDayDiv(day) {
        const dayDiv = document.createElement('div');
        dayDiv.className = `col border border-black bg-light rounded-1 btn`;
        dayDiv.style.height = '120px';
        dayDiv.textContent = day;

        //modal編輯
        dayDiv.addEventListener('click', () => {
            if (day) openEventModal(day); //day:truthy才執行
        });
        
        //行程填在正確的日期內而且可以有複數行程
        const eventsForDay = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day && eventDate.getMonth() === currMonth && eventDate.getFullYear() === currYear;
        });
        //顯示行程
        eventsForDay.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className="border border-2 border-success bg-info"
            eventDiv.textContent = event.title;
            eventDiv.addEventListener('click', (e) => {
                e.stopPropagation(); //避免點擊時冒泡到父層
                openEventModal(day, event);
            });
            dayDiv.appendChild(eventDiv);
        });

        return dayDiv;
    }

    function openEventModal(day, event = null) {
        const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
        const eventForm = document.getElementById('eventForm');
        const eventTitle = document.getElementById('eventTitle');
        const eventDate = document.getElementById('eventDate');
        const eventDescription = document.getElementById('eventDescription');
        const eventId = document.getElementById('eventId');
        const deleteBtn = document.getElementById('delete-btn');

        if (event) {
            eventTitle.value = event.title.trim();
            eventDate.value = event.date;
            eventDescription.value = event.description;
            eventId.value = event.id;
            deleteBtn.style.display = 'inline'; // 有事件存在時顯示刪除按鈕
        } else {
            eventTitle.value = '';
            eventDate.value = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; //要符合`YYYY-MM-DD`格式
            eventDescription.value = '';
            eventId.value = '';
            deleteBtn.style.display = 'none'; // 隱藏刪除按鈕
        }
        //提交
        eventForm.onsubmit = (e) => {
            e.preventDefault();
            const id = eventId.value || Date.now().toString();
            //物件
            const newEvent = {
                id,
                title: eventTitle.value,
                date: eventDate.value,
                description: eventDescription.value
            };

            if (eventId.value) {
                const index = events.findIndex(event => event.id === id);
                events[index] = newEvent; //如果存在代表編輯
            } else {
                events.push(newEvent); //不存在就是新增
            }

            saveEvents();
            renderCalendar(currMonth, currYear);
            eventModal.hide(); //操作完就關閉
        };
        //刪除
        deleteBtn.onclick = () => {
            if (eventId.value) {
                events = events.filter(event => event.id !== eventId.value);
                saveEvents();
                renderCalendar(currMonth, currYear);
                eventModal.hide();
            }
        };

        eventModal.show();
    }
    //Today功能
    document.querySelector('#today-btn').addEventListener('click', () => {
        currDate = new Date();
        currMonth = currDate.getMonth();
        currYear = currDate.getFullYear();
        renderCalendar(currMonth, currYear);
    });
    // < 功能
    document.querySelector('#pre-btn').addEventListener('click', () => changeMonth(-1));
    // > 功能
    document.querySelector('#next-btn').addEventListener('click', () => changeMonth(1));
    // + 功能
    document.querySelector('#add-btn').addEventListener('click', () => openEventModal(currDate.getDate()));


    //前後月的渲染
    function changeMonth(offset) { //offset = 1 or -1
        currMonth += offset;
        if (currMonth > 11) {
            currMonth = 0;
            currYear++;
        } else if (currMonth < 0) {
            currMonth = 11;
            currYear--;
        }
        renderCalendar(currMonth, currYear);
    }

    
    //行程儲存到localStorage
    function saveEvents() {
        localStorage.setItem('events', JSON.stringify(events));
    }

    //做完每次的操作後都會渲染一次(更新)
    renderCalendar(currMonth, currYear);
});