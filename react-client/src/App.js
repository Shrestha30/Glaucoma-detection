import React, { useEffect} from 'react'

function App() {

  useEffect(() => {
    fetch('/mem',{method:'GET'}).then(
      res => res.json()
    ).then(
      data => {
        console.log(data)
      }
    )
  })

  let mone = (e)=>{

    const data = {'email':'ka@g.com'} 

    fetch('/logi', {
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    }).then(resp => {
      resp.json().then(data => {console.log(data)})
    })
  }

  let meow = (e) => {
    //let url = 'http://localhost:5000/dow';
    const aTag = document.createElement('a');
    aTag.href = 'http://localhost:5000/dow';
    aTag.setAttribute('download','C100P61ThinF_IMG_20150918_144104_cell_165.png');
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();

    // fetch(url, {
    //   mode : 'no-cors',
    // })
    //   .then(response => response.blob())
    //   .then(blob => {
    //   let blobUrl = window.URL.createObjectURL(blob);
    //   let a = document.createElement('a');
    //   // url+='.png'
    //   a.download = url.replace(/^.*[\\\/]/, '');
    //   a.href = blobUrl;
    //   document.body.appendChild(a);
    //   a.click();
    //   a.remove();
    // })
  }

  return (
    <>
      <div onClick={mone()}>App</div>
      <button onClick={meow}>download</button>
      <input accept="image/*" multiple type="file"
                onChange={(e) => {
                  console.log(e.target.files);

                  const data = new FormData();
                  data.append('file', e.target.files[0]);
              
                  fetch('/up', {
                    method: 'POST',
                    body: data,
                  }).then((response) => {
                    response.json().then((body) => {
                      console.log(body)
                    });
                  });

                }}></input>
      
    </>
  )
}

export default App