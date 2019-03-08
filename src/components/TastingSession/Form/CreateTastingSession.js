import React from "react";
import { graphql, compose, Query, Mutation } from "react-apollo";

import ListWines from "./ListWines";
import ListWineTasters from "./ListWineTasters";
import CreateWineTaster from "./CreateWineTaster";
import CreateWine from "./CreateWine";
import CreateReview from "./CreateReview";

import UPDATE_TASTING_SESSION from "../../../graphql/mutations/UPDATE_TASTING_SESSION";
import LOCAL_STATE from "../../../graphql/queries/LOCAL_TASTING_SESSION";
import initialState from "../../../graphql/initialState";

import { Redirect } from 'react-router-dom';

import Swal from 'sweetalert2';
import { isNullOrUndefined } from "util";


const CreateTastingSession = props => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 3000
  });

  let checkSession = (data) => {

    this.toast.fire({
      type:'warning',
      title: "data"
    })
    if (data.length < 1)
      window.location = "/";
  }


  let ShowSuccess = () => {
    Toast.fire({
      type: 'success',
      title: 'Session completed successfully'
    })

    window.location = "/";


  }


  

  return (
    <Query query={LOCAL_STATE} 
    onCompleted={data => {
      if(data.sessionID === "")
        window.location = "/"
    }}>
      {({ loading, error, data }) => {
        if (loading) return "LOADING";
        if (error) return `Error! ${error.message}`;
        const {
          sessionID,
          sessionWines,
          sessionWineTasters,
          // sessionReviews,
        } = data;
        
        

        const sessionWineIDs = sessionWines.map(wine => {
          
          return { id: wine.id };
        });
        const sessionWineTastersIDs = sessionWineTasters.map(taster => {
          return { id: taster.id };
        });        
        return (
          <div className="card">
          
            <div className="card-header">
            Create New Tasting Session            
            </div>
            <div className="card-body">
            <div class="row">
            <div class="col-sm-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">
                    <ol
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >            
                    {sessionWines
                      ? sessionWines.map((wine, i) => {
                          return (
                            <li key={`sessionWine${i}`} style={{ listStyle: "none" }}>
                              {wine.name}
                            </li>
                          );
                        })
                      : null}
                  </ol>
                  </h5>
                  <p class="card-text">
                  <h5>Choose Wine(s)</h5>
                      <ListWines
                        cb={wine => {
                          if (!wine.includes(wine)) {
                            this.setState({
                              wines: [...this.state.wines, wine],
                            });
                          }
                        }}
                        placeholder="Existing Wines"
                      />
                      <br />
                      <CreateWine />
                  </p>
                  
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">
                        <ol>
                    {sessionWineTasters
                      ? sessionWineTasters.map((taster, i) => {
                          return (
                            <li key={`sessionTasters${i}`}>
                              <div>
                                {taster.name}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                  }}
                                >
                                  {sessionWines.map((wine, i) => {
                                    return (
                                      <div key={`${taster.name}wine${i}`}>
                                        <CreateReview
                                          wineTaster={taster.id}
                                          wine={wine.id}
                                          tastingSession={sessionID}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </li>
                          );
                        })
                      : null}
                  </ol>
                  </h5>
                  <p class="card-text">
                    <h5>Choose Wine Taster(s)</h5>  
                    <ListWineTasters placeholder="Existing Wine Tester" />
                    <br />
                    <CreateWineTaster />
                  </p>                  
                </div>
              </div>
            </div>
          </div>
      
              
              <p className="card-text">
              
              
            
            
            
            
            
            <Mutation
              mutation={UPDATE_TASTING_SESSION}
              variables={{ sessionWineIDs, sessionWineTastersIDs, sessionID }}
              update={cache => {
                cache.writeQuery({
                  query: LOCAL_STATE,
                  data: initialState,
                });
              }}
              onCompleted={() => ShowSuccess()}
            >
              {postMutation => (
                <button
                  className="btn btn-primary"
                  onClick={postMutation}
                  style={{
                    padding: "10px",
                    margin: "30px",
                    width: "800px",
                  }}
                >
                  Complete Session
                </button>
              )}
            </Mutation>
              
              </p>
              
            </div>
          </div>          
        );
      }}
    </Query>
  );
};

export default compose(
  graphql(UPDATE_TASTING_SESSION, {
    name: "updateTastingSession",
  })
)(CreateTastingSession);
