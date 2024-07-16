import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyD4cgRYcnFy3Hg-s0e8Mp1sXi7d8jDrtvg",
  authDomain: "dmoraxplay-ff8b4.firebaseapp.com",
  projectId: "dmoraxplay-ff8b4",
  storageBucket: "dmoraxplay-ff8b4.appspot.com",
  messagingSenderId: "326143016272",
  appId: "1:326143016272:web:a42b99b3e2c376f5e0c055",
  measurementId: "G-XVPRSZCP6X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // Get a list of cities from your database
  public async getPendientes() {
    const citiesCol = collection(db, 'pendientes');
    const pendientesSnapshot = await getDocs(citiesCol);
    const pendientesyList = pendientesSnapshot.docs.map(doc => {
      return {
        id: doc.id, // Obtener el ID del documento
        ...doc.data() // Obtener los datos del documento
      };
    });
    return pendientesyList;
  }

  // Actualizar un documento en Firestore
  public async actualizarPendiente(pendienteId: string, newData: any) {
    const pendienteRef = doc(db, 'pendientes', pendienteId);
    await updateDoc(pendienteRef, newData);
  }

  // Eliminar un documento en Firestore
  public async eliminarPendiente(pendienteId: string) {
    const pendienteRef = doc(db, 'pendientes', pendienteId);
    await deleteDoc(pendienteRef);
  }

  // Añadir un nuevo documento a Firestore
  public async agregarPendiente(nuevoPendiente: any) {
    delete nuevoPendiente.id;
    await addDoc(collection(db, 'pendientes'), nuevoPendiente);
  }

}
