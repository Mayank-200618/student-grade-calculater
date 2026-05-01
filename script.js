/* =============================
   Grade Mapping Function
   ============================= */
function getGrade(marks){
  if(marks>=90) return ["O",10];
  if(marks>=80) return ["A+",9];
  if(marks>=70) return ["A",8];
  if(marks>=60) return ["B+",7];
  if(marks>=50) return ["B",6];
  if(marks>=40) return ["C",5];
  return ["F",0];
}

/* =============================
   Sample Data (6 subjects)
   ============================= */
let subjects = JSON.parse(localStorage.getItem("subjects")) || [
  {name:"Math",credits:4,marks:85},
  {name:"Physics",credits:3,marks:72},
  {name:"Chemistry",credits:3,marks:65},
  {name:"DSA",credits:4,marks:91},
  {name:"English",credits:2,marks:55},
  {name:"EVS",credits:2,marks:38}
];

let prevSGPAs = [];

/* =============================
   Render Table
   ============================= */
function render(){
  let body = document.getElementById("tableBody");
  body.innerHTML="";

  subjects.forEach((s,i)=>{
    let [g,p]=getGrade(s.marks);

    let row = `
      <tr>
        <td>${s.name}</td>
        <td>${s.credits}</td>
        <td>${s.marks}</td>
        <td class="${p>0?'pass':'fail'}">${g}</td>
        <td>${p}</td>
        <td><button onclick="del(${i})">X</button></td>
      </tr>
    `;
    body.innerHTML+=row;
  });

  calculateSGPA();
  save();
}

/* =============================
   SGPA Calculation
   Formula:
   SGPA = Σ(Credit × Grade Point) / Σ(Credits)
   ============================= */
function calculateSGPA(){
  let totalCredits=0;
  let weightedSum=0;

  subjects.forEach(s=>{
    let [,points]=getGrade(s.marks);

    totalCredits += s.credits;
    weightedSum += (s.credits * points);
  });

  let sgpa = totalCredits ? (weightedSum/totalCredits).toFixed(2) : 0;

  document.getElementById("sgpaValue").innerText = sgpa;

  updateCard(sgpa);
}

/* =============================
   Add Subject
   ============================= */
document.getElementById("subjectForm").addEventListener("submit",e=>{
  e.preventDefault();

  let name = document.getElementById("name").value;
  let credits = +document.getElementById("credits").value;
  let marks = +document.getElementById("marks").value;

  subjects.push({name,credits,marks});
  e.target.reset();
  render();
});

/* Auto grade fill */
document.getElementById("marks").addEventListener("input",()=>{
  let marks = document.getElementById("marks").value;
  let [g] = getGrade(marks);
  document.getElementById("grade").value = g;
});

/* Delete */
function del(i){
  subjects.splice(i,1);
  render();
}

/* =============================
   CGPA
   ============================= */
function addPrev(){
  let val = +document.getElementById("prevSgpa").value;
  if(val){
    prevSGPAs.push(val);
    calcCGPA();
  }
}

function calcCGPA(){
  let current = parseFloat(document.getElementById("sgpaValue").innerText);
  let all = [...prevSGPAs, current];

  let avg = all.reduce((a,b)=>a+b,0)/all.length;
  document.getElementById("cgpa").innerText = avg.toFixed(2);
}

/* =============================
   Grade Card
   ============================= */
function updateCard(sgpa){
  let cgpa = document.getElementById("cgpa").innerText;

  let status = sgpa>=9 ? "Honours 🎉" :
               sgpa>=7 ? "First Class 👍" :
               sgpa>=5 ? "Pass 🙂" : "Fail ❌";

  let content = subjects.map(s=>{
    let [g]=getGrade(s.marks);
    return `${s.name} - ${g}`;
  }).join("<br>");

  document.getElementById("cardContent").innerHTML = `
    ${content}<br><br>
    SGPA: ${sgpa}<br>
    CGPA: ${cgpa}<br>
    Status: ${status}
  `;
}

/* =============================
   Export
   ============================= */
function download(){
  let text = document.getElementById("cardContent").innerText;
  let blob = new Blob([text], {type:"text/plain"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "grade_card.txt";
  a.click();
}

/* =============================
   Save to localStorage
   ============================= */
function save(){
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

/* Init */
render();
