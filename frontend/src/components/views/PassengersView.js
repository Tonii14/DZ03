import React from "react";
import { Table, Button, Container } from 'react-bootstrap'
import axios from 'axios'
import { URL } from '../shared/Constants'
import { Navigate } from 'react-router-dom'
import Navigation from '../shared/Navigation'
import '../../styles/index.css'

class PassengersView extends React.Component {
    constructor() {
        super();
        this.state = {
            flights: [],
            passengers: [],
            selectedFlight: "",
            searchTerm: "",
            toEditingForm: false,
            toAddingForm: false
        }
        this.handleOptionChange = this.handleOptionChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.getFlights = this.getFlights.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.addPassenger = this.addPassenger.bind(this)
    }

    componentDidMount() {
        this.getFlights();
    }

    getFlights(){
        /*this.setState({
              flights: [
                  {
                    "naziv": "FR82723",
                    "idLeta": "0",
                    "vrijemeDolazak": "2023-05-01 15:30:00.000",
                    "vrijemePolazak": "2023-05-01 14:30:00.000",
                    "brojSjedala": "50",
                    "status": "Na vrijeme"
                  },
                  {
                      "naziv": "FR02840",
                      "idLeta": "1",
                      "vrijemeDolazak": "2023-05-09 21:30:00.000",
                      "vrijemePolazak": "2023-05-09 19:30:00.000",
                      "brojSjedala": "200",
                      "status": "Odgoden"
                  },
                  {
                      "naziv": "HR02984",
                      "idLeta": "2",
                      "vrijemeDolazak": "2023-05-09 21:30:00.000",
                      "vrijemePolazak": "2023-05-09 19:30:00.000",
                      "brojSjedala": "150",
                      "status": "Na vrijeme"
                  }
              ]
          });*/
          //console.log(data)
          axios.get(URL + '/getFlights')
              .then(response => {
                console.log(response.data)
                  this.setState({
                      flights: response.data
                  })
              })
              .catch((error) => {
                  console.log(error)
            })
    }

    handleOptionChange(event) {
        //console.log(event.target.value)
        this.setState({
            selectedFlight: event.target.value,
        });
        let data = {
            idLeta : event.target.value
        }
        axios.post(URL + '/getPassengersByFlightId', data)
              .then(response => {
                console.log(response.data)
                  this.setState({
                      passengers: response.data
                  })
              })
              .catch((error) => {
                  console.log(error)
        })
    }

    handleSearch(event){
        console.log(event.target.value)
        this.setState({ 
            searchTerm: event.target.value 
        });
    }

    handleDelete(passenger){
        let updatedPassengers = this.state.passengers
        //console.log(passenger, this.state.selectedFlight)

        if(!updatedPassengers.includes(passenger)){
            updatedPassengers.push(passenger)
        }else{
            updatedPassengers = updatedPassengers.filter(x => x !== passenger)
        }
        
        this.setState({
            passengers: updatedPassengers
        },() => {
          //console.log(this.state.lines);
        })

        let data = {
            idKorisnik: passenger.idKorisnik,
            idLeta: this.state.selectedFlight
        }
        axios.post(URL + '/deletePassenger', data, { withCredentials: false })
            .then(response => {
                console.log(response.status)

            })
            .catch((error) => {
                console.log(error)
        })
    }

    handleEdit(passenger) {
        localStorage.setItem('putnik', JSON.stringify(passenger))
        localStorage.setItem('let',  JSON.stringify(this.state.selectedFlight))
        this.setState({
            toEditingForm: true,
        });
    }

    addPassenger() {
        if(this.state.selectedFlight !== ""){
            this.setState({
                toAddingForm: true,
            });
            localStorage.setItem('let',  JSON.stringify(this.state.selectedFlight))
        }
    }

    render() {
        if (this.state.toEditingForm) {
            return (
                <Navigate to='/passengers/editPassenger' />
            )
        }
        if (this.state.toAddingForm) {
            return (
                <Navigate to='/passengers/addPassenger' />
            )
        }

        const flights = this.state.flights
        let i = 0
        const listFlights = flights.map(flight =>
            <option key={i++} value={flight.idLeta}>{flight.naziv}</option>
        )

        const passengers = this.state.passengers
        let j = 0
        let searchQuery = this.state.searchTerm
        const filteredPassengers = passengers.filter(passenger => {
            console.log(passenger)
            const fullName = `${passenger.ime} ${passenger.prezime}`; // Concatenate name and surname
            //console.log(fullName, fullName.toLowerCase().includes(searchQuery.toLowerCase())); // Case-insensitive search
            return fullName.toLowerCase().includes(searchQuery.toLowerCase()); // Case-insensitive search
        });

        const listPassengers = filteredPassengers.map(passenger =>
            <tr key={j++}>
                <td>{passenger.ime}</td>
                <td>{passenger.prezime}</td>
                <td>{passenger.klasaKarte}</td>
                <td>{passenger.brojSjedala}</td>
                <td>{passenger.prtljaga}</td>
                <td><Button variant="primary" className="inline- text-white" value={passenger.idKorisnik} onClick={() => this.handleEdit(passenger)}>Edit</Button></td>
                <td><Button variant="danger" className="inline- text-white" value={passenger.idKorisnik} onClick={() => this.handleDelete(passenger)}>Delete</Button></td>
            </tr>
        )

        return (
            <Container data-testid="passengers-view" className="Margin-top font">
                <br />
                <Navigation  />
                <hr />               
                <div className="d-flex py-2">
                    <select defaultValue="" value={this.state.value} onChange={this.handleOptionChange} className="btn btn-secondary dropdown-toggle">
                        <option value="" disabled>Odaberite let</option>
                        {listFlights}
                    </select>

                    <div className="form-inline my-2 my-sm-0 input-group mb-3">
                        <input 
                            className="form-control" 
                            type="search" 
                            placeholder="Search" 
                            value={this.state.searchTerm}
                            onChange={this.handleSearch}
                        />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="button">Search</button>
                    </div>
                </div>
                <Table className="table-hover mt-4">
                    <thead className="thead-dark">
                        <tr>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Klasa karte</th>
                            <th>Broj sjedala</th>
                            <th>Količina prtljage</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listPassengers}
                    </tbody>
                </Table>
                <Button variant="primary" className="inline- text-white" onClick={() => this.addPassenger()}>Add new +</Button>
            </Container>
        )
    }
}

export default PassengersView;