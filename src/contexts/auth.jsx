import { useState, createContext, useEffect } from "react";
import firebase from '../services/firebaseConnection'

import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';

import { toast } from 'react-toastify'

const auth = getAuth(firebase);
const db = getFirestore(firebase);

export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser')
    
            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }
    
            setLoading(false)
        }

        loadStorage()
    }, [])

    function logIn(email, password){
        return signInWithEmailAndPassword(auth, email, password)
        .then((value)=>{
        getDoc(doc(db, "users", value.user.uid))
        .then((snapshot)=>{
            let data = {
            uid: value.user.uid,
            nome: snapshot.data().nome,
            avatarUrl: snapshot.data().avatarUrl,
            email: value.user.email,
            }
            setUser(data)
            storageUser(data)
            toast.success('Bem vindo de volta!')
        })
        })
        .catch((error)=>{
            toast.error('Credenciais inválidas')
        })
    }

    function signUp(email, password, nome){
        return createUserWithEmailAndPassword(auth, email, password)
        .then((value)=>{
            setDoc(doc(db, "users", value.user.uid), {
               nome: nome,
               avatarUrl: null, 
            })
            .then(()=>{
                let data = {
                    uid: value.user.uid,
                    nome: nome,
                    email: value.user.email,
                    avatarUrl: null
                }
                setUser(data)
                storageUser(data)
                toast.success('Bem vindo a plataforma')
            })
            .catch((error)=>{
                toast.error('Credenciais inválidas')
            })
        })
        .catch((error)=>{
            toast.error('Algo deu errado ')
        })
    }

    function storageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }

    function logOut(){
        signOut(auth).then(() => {
            toast.success('saiu com sucesso')
            localStorage.removeItem('SistemaUser')
            setUser(null)
        }).catch((error) => {
            toast.error('Ops, algo deu errado')
        });
    }

    return(
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            loading,
            signUp,
            logOut,
            logIn,
            setUser,
            storageUser
            }}
            >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider