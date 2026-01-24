*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family: 'Segoe UI', sans-serif;
}

body{
    background:#f2f4f8;
    color:#222;
}

/* HEADER */
header{
    background:#ffffff;
    padding:16px;
    text-align:center;
    font-size:20px;
    font-weight:700;
    box-shadow:0 2px 10px rgba(0,0,0,.08);
}

/* SECTIONS */
.section{
    display:none;
    padding:20px;
    animation:fade .4s ease;
}
.section.active{
    display:block;
}

@keyframes fade{
    from{opacity:0; transform:translateY(10px);}
    to{opacity:1; transform:none;}
}

/* CARD */
.card{
    background:#fff;
    border-radius:16px;
    padding:20px;
    margin-bottom:16px;
    box-shadow:0 10px 30px rgba(0,0,0,.05);
}

.center{text-align:center}

.balance{
    font-size:30px;
    font-weight:700;
    margin:10px 0;
}

/* BUTTONS */
button{
    width:100%;
    padding:14px;
    border:none;
    border-radius:14px;
    font-size:15px;
    font-weight:600;
    cursor:pointer;
}

.btn-main{
    background:#2ecc71;
    color:#fff;
}

.btn-alt{
    background:#3498db;
    color:#fff;
    margin-top:10px;
}

.btn-disable{
    background:#bdc3c7;
    color:#555;
}

/* INPUTS */
input,select{
    width:100%;
    padding:12px;
    margin-top:8px;
    border-radius:12px;
    border:1px solid #ddd;
    font-size:14px;
}

/* NAVBAR */
nav{
    position:fixed;
    bottom:0;
    width:100%;
    display:flex;
    background:#ffffff;
    box-shadow:0 -3px 15px rgba(0,0,0,.12);
}

nav div{
    flex:1;
    text-align:center;
    padding:12px;
    font-size:13px;
    cursor:pointer;
}

nav .active{
    color:#2ecc71;
    font-weight:700;
}

/* BRAND */
.brand{
    margin-top:12px;
    font-size:13px;
    color:#777;
      }
