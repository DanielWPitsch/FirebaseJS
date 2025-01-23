import { useState } from "react";
import './home.css';
import { Link, Navigate, useNavigate } from "react-router-dom";
import {auth} from '../../firebaseConection';
import { signInWithEmailAndPassword } from "firebase/auth";


export default function Home() {
  const[email, setEmail] = useState('')
  const[senha, setSenha] = useState('')

  const navigate = useNavigate();

  async function handleLogin(e){
    e.preventDefault();

    if(email !== '' && senha !== ''){
      await signInWithEmailAndPassword(auth, email, senha)
      .then(()=>{
        navigate('/admin', {replace: true} )
      })
      .catch(()=>{
        alert("Erro ao tentar fazer login")
      })
    }else{
      alert("Preencha todos os campos!")
    }
  }
    return(
      <div className="home-container">
        <h1> Lista de tarefas</h1>
        <span> Gerencie sua agenda de forma fácil.</span>

        <form className="form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Digite seu email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          /> 

          <input
            type="password"
            placeholder="********"
            value={senha}
            onChange={(e)=>setSenha(e.target.value)}
          />

          <button type="submit"> Acessar </button>
        </form>

        <Link to="/register" className="button-link">
          Não possui uma conta? Cadastre-se
        </Link>
      </div>
    )
}