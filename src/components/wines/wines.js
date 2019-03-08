import React, { Component } from "react";
import { graphql,Query  } from "react-apollo";
import Swal from "sweetalert2";
import WINES from "../../graphql/queries/WINES";
import UPDATE_WINE from "../../graphql/mutations/UPDATE_WINE";
import DELETE_WINE from "../../graphql/mutations/DELETE_WINE";
import CreateWine from "../TastingSession/Form/CreateWine";

const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 3000
  });

class ListWines extends Component {
    
    deleteWine = (id) => {
        
        Swal.fire
        ({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {

                this.props.mutate({
                    variables: {
                        id: id
                    },
                    mutation: DELETE_WINE,                    
                  })
                  .then(result => { 
                    Toast.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                      )
                   })
                  .catch(error => { 
                      Toast.fire({
                    type:"success",
                    title:"Wine Updated Correctly",
                    text:error
                }) });

              
            }
          })
    }
    submit = (od,newobj) => {
        

        console.log(newobj);
        console.log(od);

        this.props.mutate({
            variables: {
                id: od.id,
                name: newobj.name?newobj.name:od.name,
                winery: newobj.Winery?newobj.Winery:od.Winery,
                year: newobj.year?newobj.year:od.year,
                alcohol: newobj.alcohol?newobj.alcohol:od.alcohol,
                image: newobj.image?newobj.image:od.image,
                price: newobj.price?newobj.price:od.price,
                size: newobj.size?newobj.size:od.size,
                color: newobj.color?newobj.color:od.color
            },
            mutation: UPDATE_WINE,
            
          })
          .then(result => { 
              Toast.fire({
                  type:"success",
                  title:"Wine Updated Correctly"                  
              })
           })
          .catch(error => { 
              Toast.fire({
            type:"success",
            title:"Wine Updated Correctly",
            text:error
        }) });
        
    }

  inputHandler = e => {
    let { name, value } = e.target;
    if (name === "tastingNotes") {
      this.setState({
        tastingNotes: [...e.target.selectedOptions].map(o => o.value),
      });
    } else {
      if (name === "score") value = Number(value);
      this.setState({ [name]: value });
    }
  };

  render() {    
    // const { wineTaster, wine, tastingSession } = this.props;
    return (
      <div>
          <div className="container">
          <CreateWine />
          <button className="btn btn-outline-primary" onClick={()=>window.location = "/Wines"}>Refresh</button>
          </div>
        <Query query={WINES}>
      {({ loading, error, data }) => {
        if (loading) return "LOADING";
        if (error) return `Error! ${error.message}`;
        const { wines } = data;     
        

        return (
          <div className="d-inline-flex p-2 bd-highlight">
            {wines?wines.map((wine, i) => {
              return (
                <div key={`wine${i}`} value={wine.id} className="card" style={{width: "18rem", margin:"10px"}}>
                
                    <img src={wine.image?wine.image:"assets/img/tastesession.png"} class="card-img-top" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title">Wine</h5>
                        
                        <form onSubmit={(e) => {
                                let name = e.target.name.value;
                                let Winery = e.target.Winery.value;
                                let year = e.target.year.value;
                                let alcohol = e.target.alcohol.value;
                                let image = e.target.image.value;
                                let price = e.target.price.value;
                                let size = e.target.size.value;
                                let color = e.target.color.value;
                                e.preventDefault();
                                console.log(e.currentTarget.name.value);
                                this.submit(wine,{name,Winery,year,alcohol,image,price,size,color})
                            }
                        }>
                        <div class="form-group">
                                <label for="exampleFormControlInput1">Name</label>
                                <input type="text" class="form-control" name="name" id="exampleFormControlInput1" 
                                    placeholder={wine.name}
                                />
                            </div>                            
                            <br />
                            <div class="form-group">
                                <label for="Winery">Winery</label>
                                <input type="text" class="form-control" name="Winery" id="Winery" 
                                    placeholder={wine.winery}
                                />
                            </div>
                            <div class="form-group">
                                <label for="year">year</label>
                                <input type="text" class="form-control" name="year" id="year" 
                                    placeholder={wine.year}
                                />
                            </div>
                            <br />
                            <div class="form-group">
                                <label for="alcohol">alcohol</label>
                                <input type="text" class="form-control" name="alcohol" id="alcohol" 
                                    placeholder={wine.alcohol}
                                />
                            </div>
                            <div class="form-group">
                                <label for="image">image</label>
                                <input type="text" class="form-control" name="image" id="image" 
                                    placeholder={wine.image}
                                />
                            </div>
                            <div class="form-group">
                                <label for="price">price</label>
                                <input type="text" class="form-control" name="price" id="price" 
                                    placeholder={wine.price}
                                />
                            </div>
                            <div class="form-group">
                                <label for="size">size</label>
                                <input type="text" class="form-control" name="size" id="size" 
                                    placeholder={wine.size}
                                />
                            </div>
                            <div class="form-group">
                                <label for="color">color</label>
                                <input type="text" class="form-control" name="color" id="color" 
                                    placeholder={wine.color}
                                />
                            </div>

                            <button className="btn btn-outline-secondary">Update!</button>
                        </form>
                        <button className="btn btn-outline-danger" onClick={() => this.deleteWine(wine.id)}>Delete</button>
                        
                    </div>

                
                </div>
              );
            }):""}
          </div>
        );
      }}
    </Query>

      </div>
    );
  }
}

export default graphql(UPDATE_WINE)(ListWines);
