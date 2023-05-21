import React from "react";
import { Table, Button, Container } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { URL } from '../shared/Constants'
import Navigation from '../shared/Navigation'

class Flights extends React.Component {
    constructor() {
        super();
        this.state = {
            flights: [],
            nazivLinije: "",
            idLinije: "",
            toEditingForm: false
        }
        this.getFlights = this.getFlights.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.addFlight = this.addFlight.bind(this)
    }

    componentDidMount() {
        var data = localStorage.getItem('linija');
        var linija = JSON.parse(data);
        this.setState({
            nazivLinije: linija.naziv,
            idLinije: linija.idLinije
        })
        this.getFlights(linija.idLinije);
    }

    getFlights(idLinije) {
        let data = {
            idLinije: idLinije
        }
        console.log(data)
        axios.post(URL + '/getFlightsByLineId', data, {headers: {
            'Content-Type': 'application/json',
          }})
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

    handleEdit(flight) {
        localStorage.setItem('let', JSON.stringify(flight))
        this.setState({
            toEditingForm: true,
        });
    }

    handleDelete(flight){
        let updatedFlights = this.state.flights

        if(!updatedFlights.includes(flight)){
            updatedFlights.push(flight)
        }else{
            updatedFlights = updatedFlights.filter(x => x !== flight)
        }
        
        this.setState({
            flights: updatedFlights
        },() => {
          //console.log(this.state.lines);
        })

        let data = {
            idLeta: flight.idLeta
        }
         axios.post(URL + '/deleteFlight', data)
            .then(response => {
                console.log(response.status)

            })
            .catch((error) => {
                console.log(error)
        })
    }

    addFlight() {
        this.setState({
            toAddingForm: true,
        });
        localStorage.setItem('idLinije', JSON.stringify(this.state.idLinije))
    }

    render() {
        if (this.state.toAddingForm) {
            return (
                <Navigate to='/flights/addFlight' />
            )
        }

        if (this.state.toEditingForm) {
            return (
                <Navigate to='/flights/editFlight' />
            )
        }

        const flights = this.state.flights
        let i = 0
        const listFlights = flights.map(flight =>
            <tr key={i++}>
                <td>{flight.naziv}</td>
                <td>{flight.vrijemePolazak}</td>
                <td>{flight.vrijemeDolazak}</td>
                <td>{flight.status}</td>
                <td><Button variant="primary" className="inline- text-white" value={flight.idLinije} onClick={() => this.handleEdit(flight)}>Edit</Button></td>
                <td><Button variant="danger" className="inline- text-white" value={flight.idLinije} onClick={() => this.handleDelete(flight)}>Delete</Button></td>
            </tr>
        )

        return (
            <Container className="Margin-top font">
                <br />
                <Navigation  />
                <hr />
                <h3 className="text-center font">Letovi za liniju {this.state.nazivLinije}</h3>
                <Table className="table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Naziv</th>
                            <th>Vrijeme polaska</th>
                            <th>Vrijeme dolaska</th>
                            <th>status</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listFlights}
                    </tbody>
                </Table>
                <Button variant="primary" className="inline- text-white" onClick={() => this.addFlight()}>Add new +</Button>
            </Container>
        )
    }
}

export default Flights;