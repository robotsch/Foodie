const fs = require("fs");

const db = [
  "Christopher",
  "Michael",
  "Jessica",
  "Matthew",
  "Ashley",
  "Jennifer",
  "Joshua",
  "Amanda",
  "Daniel",
  "David",
  "James",
  "Robert",
  "John",
  "Joseph",
  "Andrew",
  "Ryan",
  "Brandon",
  "Jason",
  "Justin",
  "Sarah",
  "William",
  "Jonathan",
  "Stephanie",
  "Brian",
  "Nicole",
  "Nicholas",
  "Anthony",
  "Heather",
  "Eric",
  "Elizabeth",
  "Adam",
  "Megan",
  "Melissa",
  "Kevin",
  "Steven",
  "Thomas",
  "Timothy",
  "Christina",
  "Kyle",
  "Rachel",
  "Laura",
  "Lauren",
  "Amber",
  "Brittany",
  "Danielle",
  "Richard",
  "Kimberly",
  "Jeffrey",
  "Amy",
  "Crystal",
  "Michelle",
  "Tiffany",
  "Jeremy",
  "Benjamin",
  "Mark",
  "Emily",
  "Aaron",
  "Charles",
  "Rebecca",
  "Jacob",
  "Stephen",
  "Patrick",
  "Sean",
  "Erin",
  "Zachary",
  "Jamie",
  "Kelly",
  "Samantha",
  "Nathan",
  "Sara",
  "Dustin",
  "Paul",
  "Angela",
  "Tyler",
  "Scott",
  "Katherine",
  "Andrea",
  "Gregory",
  "Erica",
  "Mary",
  "Travis",
  "Lisa",
  "Kenneth",
  "Bryan",
  "Lindsey",
  "Kristen",
  "Jose",
  "Alexander",
  "Jesse",
  "Katie",
  "Lindsay",
  "Shannon",
  "Vanessa",
  "Courtney",
  "Christine",
  "Alicia",
  "Cody",
  "Allison",
  "Bradley",
  "Samuel",
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max + 1);
}

const nameGen = (db) => {
  return db[getRandomInt(99)];
};

const emailGen = (fname, lname) => {
  let num = getRandomInt(999);
  let address = `${fname}${lname}${num}@gmail.com`;
  return address;
};

const phoneGen = () => {
  let num = "416-";

  for (let i = 0; i < 3; i++) {
    let x = getRandomInt(9);
    num += x;
  }

  num += "-";

  for (let i = 0; i < 4; i++) {
    let x = getRandomInt(9);
    num += x;
  }

  return num;
};

const printUsers = (number, db) => {
  for (let x = 0; x < number; x++) {
    let fname = nameGen(db);
    let lname = nameGen(db);
    let email = emailGen(fname, lname);
    let phone = phoneGen();
    let content = `INSERT INTO users (email, password, first_name, last_name, phone_number) VALUES ('${email}', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.', '${fname}', '${lname}', '${phone}');`;

    fs.appendFile("./users.txt", content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file written successfully
    });
  }
};

printUsers(100, db);
