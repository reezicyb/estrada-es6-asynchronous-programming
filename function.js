class Student {
    constructor(id, name, age, course) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.course = course;
    }
    
    introduce() {
        return `Hi, my name is ${this.name}, I am ${this.age} years old, and I am enrolled in ${this.course}.`;
    }
}

class Instructor {
    constructor(id, name, subject) {
        this.id = id;
        this.name = name;
        this.subject = subject;
    }

    teach() {
        return `I am ${this.name} and I teach ${this.subject}.`;
    }
}

const outputEl = document.getElementById("output");

function clearOutput() {
    outputEl.innerHTML = "";
}

function render(data) {
    clearOutput();

    const { students, courses, instructors } = data;

    const stCard = document.createElement("div");
    stCard.className = "card";
    stCard.innerHTML = `<h3>Students</h3>`;
    const stList = document.createElement("ul");

    students.forEach((s) => {
        const li = document.createElement("li");
        const text = `${s.name} (${s.age}) - ${s.course}`;

        let badges = "";

        if (s.name.includes("Daniel Padilla")) {
            badges += `<span class="rank-badge rank-ss">SS</span>`;
        } else if (s.name.includes("Enrique Gil")) {
            badges += `<span class="rank-badge rank-s">S</span>`;
        } else if (s.name.includes("Raiko Estrada")) {
            badges += `<span class="rank-badge rank-c">C</span>`;
        } else if (s.name.includes("Brent Manalo")) {
            badges += `<span class="rank-badge rank-a">A</span>`;
        } else if (s.name.includes("James Reid")) {
            badges += `<span class="rank-badge rank-a">A</span>`;
        }
        
        if (s.age > 21) {
            li.innerHTML = `
            <span class="student-highlight">${text}</span>
            <span class="badge-21">21+</span>
            `;
        } else {
            li.textContent = text;
        }

        li.innerHTML += ` ${badges}`;
        stList.appendChild(li);
    });

    stCard.appendChild(stList);
    outputEl.appendChild(stCard);

    const cCard = document.createElement("div");
    cCard.className = "card";
    cCard.innerHTML = `<h3>Courses</h3>`;
    const cList = document.createElement("ul");

    courses.forEach((c) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${c.title}:</strong> ${c.description}`;
        cList.appendChild(li);
    });

    cCard.appendChild(cList);
    outputEl.appendChild(cCard);

    const iCard = document.createElement("div");
    iCard.className = "card";
    iCard.innerHTML = `<h3>Instructors (3 Goats)</h3>`;
    const iList = document.createElement("ul");

    instructors.forEach((i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${i.name} - ${i.subject}
            <span class="instructor-badge">SSS+</span>
        `;
        iList.appendChild(li);
    });

    iCard.appendChild(iList);
    outputEl.appendChild(iCard);

    const relCard = document.createElement("div");
    relCard.className = "card";
    relCard.innerHTML = `<h3>Course - Instructor Mapping</h3>`;
    const relList = document.createElement("ul");

    const courseInstructorMap = {
        "Computer Science": "LeBron James",
        "Information Technology": "LeBron James",
        "Software Engineering": "LeBron James",
        "Data Science": "Kobe Bryant",
        "Cybersecurity": "Michael Jordan"
    };

    courses.forEach((c) => {
        const li = document.createElement("li");
        const instructor = courseInstructorMap[c.title] || "N/A";
        li.textContent = `${c.title} → Taught by ${instructor}`;
        relList.appendChild(li);
    });

    relCard.appendChild(relList);
    outputEl.appendChild(relCard);
}

function fetchDataPromises() {
    return fetch("data/students.json")
        .then((resp) => {
            if (!resp.ok) throw new Error("Network response was not ok");
            return resp.json();
        })
        .catch((err) => {
            console.error("Promise fetch error:", err);
            throw err;
        });
}

async function fetchDataAsync() {
    try {
        const resp = await fetch("data/students.json");
        if (!resp.ok) throw new Error("Network response was not ok");
        return await resp.json();
    } catch (err) {
        console.error("Async fetch error:", err);
        throw err;
    }   
}

async function init() {
    try {
        const [promiseData, asyncData] = await Promise.all([
            fetchDataPromises(),
            fetchDataAsync()
        ]);

        const studentObjs = promiseData.students
            .slice(0, 3)
            .map((s) => new Student(s.id, s.name, s.age, s.course));
        const instructorObjs = promiseData.instructors
            .slice(0, 2)
            .map((i) => new Instructor(i.id, i.name, i.subject));

        console.log("Student objects:", studentObjs);
        console.log("Instructor objects:", instructorObjs);

        console.log("Promise version data:", promiseData);

        console.log("Async/Await version data:", asyncData);

        const studentsInstances = asyncData.students.map(
            (s) => new Student(s.id, s.name, s.age, s.course)
        );
        const instructorsInstances = asyncData.instructors.map(
            (i) => new Instructor(i.id, i.name, i.subject)
        );

        console.log(
            "Introductions (Async):",
            studentsInstances.map((s) => s.introduce())
        );
        console.log(
            "Teach messages (Async):",
            instructorsInstances.map((i) => i.teach())
        );

        render(asyncData);

    } catch (err) {
        outputEl.innerHTML =
            `<p style="color:red">Failed to load data. See console for details.</p>`;
    }
}

init();