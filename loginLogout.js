import { db, auth } from "./firebaseConection";
import './app.css';
import { useState, useEffect } from "react";
import { doc, deleteDoc, collection, addDoc, 
         getDocs, updateDoc, onSnapshot} from 'firebase/firestore';
import { createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, signOut,
         onAuthStateChanged } from "firebase/auth";

function App() {
  const[titulo, setTitulo] = useState('');
  const[autor, setAutor] = useState('');
  const[posts, setPosts] = useState([]);
  const[idPost, setIdPost] = useState('');
  const[email, setEmail] = useState('');
  const[senha, setSenha] = useState('');
  const[user, setUser] = useState('');
  const[userDetail, setUserDetail] = useState('');

  useEffect(()=>{
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot)=>{
        let listaPost = [];

      snapshot.forEach((doc) => {
        listaPost.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      });
      setPosts(listaPost);
      })
    }
    loadPosts();

  }, [])

  useEffect(()=>{
    async function checkLogin() {
      onAuthStateChanged(auth, (user)=>{
        if(user){
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email,
          })
        }else{
          setUser(false)
          setUserDetail({})
        }
      })
    }
    checkLogin();
  })

  async function handleAdd() {

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
    .then(()=>{
      console.log("Dados registrados no banco!")
      setAutor('');
      setTitulo('');
      setIdPost('');
    })
    .catch((erro)=>{
      console.log("Gerou erro" + erro)
    })
  }

  async function buscarPost() {
    
    const postRef = collection(db, "posts")
    await getDocs(postRef)
    .then((snapshot)=>{
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      });
      setPosts(lista);
    })
    .catch(()=>{
      alert("erro ao buscar!");
    })
  }

  async function editarPost(){
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log("Dados atualizados com sucesso!")
      setAutor('')
      setTitulo('')
      setIdPost('')
    })
    .catch((erro)=>{
      console.log("Erro na atualizaão" + erro)
    })
  }

  async function excluirPost(id) {
      const docRef = doc(db, "posts", id)
      await deleteDoc(docRef)
      .then(()=>{
        alert("Post deletado com sucesso!")
      })
      .catch((erro)=>{
        alert("Erro ao tentar remover post" + erro)
      })
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(()=>{
      alert("Cadastrado com sucesso!");
      setEmail('')
      setSenha('')
    })
    .catch((erro)=>{
      if(erro.code ==='auth/weak-password'){
        alert("Senha muito fraca!")
      }else if(erro.code === 'auth/email-already-in-use')
        alert("Email já em uso!")
    })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value)=>{
      alert("Deu certo!")
      setUserDetail({
        uid: value.user.id,
        email: value.user.email,
      })
      setUser(true);
      setEmail('')
      setSenha('')
    })
    .catch(()=>{
      alert("Something went wrong")
    })
    
  }

  async function fazerLogout() {
    await signOut(auth)
    setUser(false)
    setUserDetail({})
    alert("Saindo...")
  }

  return (
    <div className="App">
      <h1><center> React JS</center></h1>
      <h2> Usuários</h2>

      { user && (
        <div>
          <strong> Seja bem-vindo(a) </strong><br/>
          <span>ID: {userDetail.uid} -Email: {userDetail.email}</span><br/>
          <button onClick={fazerLogout}> Deslogar </button>
          <br/><br/>
        </div>
      )}

      <div className="container">
        <label>Email</label>
        <input
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          placeholder="Digite um email"
        /> <br/>

        <label>Senha</label>
        <input
          value={senha}
          onChange={(e)=> setSenha(e.target.value)}
          placeholder="Digite sua senha"
        />
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Login</button>
      </div> <br/><br/>

      <hr/>
      <h2> Posts</h2>
      <div className="container">
        <label>ID do post: </label>
        <input
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={(e)=> setIdPost(e.target.value)}
        /><br/>

        <label>Titulo: </label>
        <textarea 
          type="text"
          placeholder="Digite o título"
          value={titulo}
          onChange={(e)=>setTitulo(e.target.value)}
        />
        <label>Autor: </label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e)=> setAutor(e.target.value)}
        /><br/> <br/>

        <button onClick={handleAdd}> Cadastrar </button> 
        <button onClick={buscarPost}>Buscar posts</button> 
        <button onClick={editarPost}>Atualizar Post</button>

        <ul>
          {posts.map((post)=>{
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br/>
                <span>Titulo: {post.titulo} </span><br/>
                <span>Autor: {post.autor} </span><br/>
                <button onClick={()=> excluirPost(post.id)}>Excluir Post</button><br/><br/>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
