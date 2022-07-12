// core modules
// file system
const fs = require('fs');

// readline
// const readline = require('readline');

// third party module
const validator = require('validator');

// readline interface
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

//membuat folder data apabila tidak ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// membuat file contacts json jika belom ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath,'[]','utf-8');
}

// membuat fungsi untuk menanyakan pertanyaan
// const questions = (ask) => {
//   return new Promise((resolve, reject) => {
//     rl.question(ask, (inputVariable) => {
//       resolve(inputVariable);
//     })
//   })
// }

// membuat fungsi untuk mengecek data/contacts.json
const loadContact = () => {
  const file = fs.readFileSync('data/contacts.json', 'utf8');
  const contacts = JSON.parse(file);
  return contacts;
}

// membuat fungsi untuk menampung jawaban
const getAnswer = (name, phoneNumber, email) => {
  const contact = {name, phoneNumber, email};
  const contacts = loadContact();

  // validasi nama menggunakan method find
  const duplicate = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    console.log("Nama Sudah Terdaftar, Silahkan Gunakan Nama Lain");
    // mengembalikan nilai false jika duplikat
    return false;
  } 

  // validasi nomor telepon
  if(!validator.isMobilePhone(phoneNumber, 'id-ID')) {
    console.log("Nomor Telepon Tidak Valid, Silahkan Isi Nomor Telepon yang Valid");
    // mengembalikan nilai false jika nomor tidak valid
    return false;
  }

  // validasi email
  if(!validator.isEmail(email)) {
    console.log("Email Tidak Valid, Silahkan Isi Email yang Valid");
    // mengembalikan nilai false jika email tidak valid
    return false;
  }
  
  // memasukkan data kedalam data/contacts.json
  contacts.push(contact);
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts, null, 2));
  console.log(`Terimakasih ${name} sudah memasukkan data`);
  // rl.close();
}

// fungsi untuk menampilkan list contact
const listContact = () => {
  const contacts = loadContact();
  console.log('Contact List : ');
  // menggunakan looping foreach untuk setiap data yang ada
  contacts.forEach((contact, i) => {
    console.log(`${ i + 1 }. ${ contact.name } - ${ contact.phoneNumber }`);
  });
}

// fungsi untuk melihat detail sebuah contact berdasarkan nama
const detailContact = (name) => {
  const contacts = loadContact();
  const findName = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
  if (findName) {
    console.log(`${ findName.name }'s Contact Detail : `);
    console.log(`Name : ${ findName.name }\nPhone Number : ${ findName.phoneNumber }\nEmail : ${ findName.email }`);
  } else {
    console.log(`${ name }'s Contact Not Found! Use Another Name`);
  }
}

// fungsi untuk menghapus contact berdasarkan nama
const deleteContact = (name) => {
  const contacts = loadContact();
  const findName = contacts.filter((contact) => contact.name.toLowerCase() !== name.toLowerCase());
  if (contacts.length > findName.length) {
    fs.writeFileSync('data/contacts.json', JSON.stringify(findName, null, 2));
    console.log(`${ name }'s Contact Has Been Deleted`);
  } else {
    console.log(`${ name }'s Contact Not Found! Use Another Name`);
  }
}

// fungsi untuk mengedit contact berdasarkan nama
const editContact = (nameFind, name, phoneNumber, email) => {
  const contacts = loadContact();
  const findName = contacts.find((contact) => contact.name.toLowerCase() === nameFind.toLowerCase());

  let newUsername, newPhoneNumber, newEmail;

  if (findName) {
    if (name === null || findName.name === name || name === ''   || name === undefined ) {
      newUsername = findName.name;
    } else {
      newUsername = name;
    }
    
    if (phoneNumber === null || findName.phoneNumber === phoneNumber || phoneNumber === ''  || phoneNumber === undefined ) {
      newPhoneNumber = findName.phoneNumber
    } else {
      // melakukan validasi terhadap nomor telepon
      if(!validator.isMobilePhone(phoneNumber, 'id-ID')) {
        console.log("Nomor Telepon Tidak Valid, Silahkan Isi Nomor Telepon yang Valid");
        // mengembalikan nilai false jika nomor tidak valid
        return false;
      } else {
        newPhoneNumber = phoneNumber;
      }
    }
  
    if (email === null || findName.email === email || email === ''  || email === undefined ) {
      newEmail = findName.email
    } else {
      // melakukan validasi terhadap email
      if(!validator.isEmail(email)) {
        console.log("Email Tidak Valid, Silahkan Isi Email yang Valid");
        // mengembalikan nilai false jika email tidak valid
        return false;
      } else {
        newEmail = email
      }
    }
  
    const updateData = {
      name: newUsername,
      phoneNumber: newPhoneNumber,
      email: newEmail
    }
  
    const deleteCon = contacts.filter((contact) => contact.name.toLowerCase() !== nameFind.toLowerCase());
    fs.writeFileSync('data/contacts.json', JSON.stringify(deleteCon, null, 2));
  
    deleteCon.push(updateData);
    fs.writeFileSync('data/contacts.json', JSON.stringify(deleteCon, null, 2));
  
    console.log(`${ nameFind }'s Contact Has Been Changed`);
  } else {
    console.log(`${ nameFind }'s Contact Not Found! Use Another Name`);
    return false;
  }
}

module.exports = { getAnswer, listContact, detailContact, deleteContact, editContact }
