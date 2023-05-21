import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { Alert, Container } from 'react-bootstrap'
import { URL } from '../../shared/Constants'
import Navigation from '../../shared/Navigation'

class EditFlightView extends React.Component {
    constructor() {
        super();
        this.state = {
            back: false,
            idLeta: "",
            idLinije: "",
            naziv: "",
            status: "",
            vrijemePolazak: "",
            vrijemeDolazak: "",
            updateError: false,
            errorText: ""
        }
        this.return = this.return.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount() {
        var data1 = localStorage.getItem('let');
        var data2 = localStorage.getItem('linija');
        var linija = JSON.parse(data2);
        var flight = JSON.parse(data1);
        this.setState({
            idLeta: flight.idLeta,
            idLinije: linija.idLinije,
            naziv: flight.naziv,
            status: flight.status,
            vrijemePolazak: flight.vrijemePolazak,
            vrijemeDolazak: flight.vrijemeDolazak,
        })
    }

    return() {
        localStorage.removeItem('let');
        this.setState({
            back: true
        })
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value,
        })

        //validacija vremena
        if (name === 'vrijemeDolazak' && value < this.state.vrijemePolazak) {
            const flightStartDateTime = new Date(this.state.vrijemeDolazak).getTime();
            const flightEndDateTime = new Date(value).getTime();

            if (flightEndDateTime < flightStartDateTime) {
                this.setState({ vrijemeDolazak: "" });
            }
        }
    }
    
    async handleSubmit(event) {
        event.preventDefault()
        const dateObjPolazak = new Date(this.state.vrijemePolazak);
        const dateObjDolazak = new Date(this.state.vrijemeDolazak);

        const beautifiedDatePolazak = dateObjPolazak.toLocaleDateString();
        const beautifiedTimePolazak = dateObjPolazak.toLocaleTimeString();
        const beautifiedDateDolazak = dateObjDolazak.toLocaleDateString();
        const beautifiedTimeDolazak = dateObjDolazak.toLocaleTimeString();

        const beautifiedDateTimePolazak = beautifiedDatePolazak + " " + beautifiedTimePolazak;
        const beautifiedDateTimeDolazak = beautifiedDateDolazak + " " + beautifiedTimeDolazak;

        let data = {
            idLinije: this.state.idLinije,
            idLeta: this.state.idLeta,
            naziv: this.state.naziv,
            vrijemePolazak: beautifiedDateTimePolazak,
            vrijemeDolazak: beautifiedDateTimeDolazak,
            status: this.state.status
        }
        console.log(data)
        axios.post(URL + '/editFlight', data)
            .then(response => {
                if (response.data !== "Format naziva leta je pogresan") {
                    console.log(response.status)
                    localStorage.removeItem('let');
                    window.location = "/flights"
                }else{
                    this.setState({
                        updateError: true,
                        errorText: response.data
                    })
                }
            })
            .catch(error => {
                console.log(error)
        })
    }

    render() {
        if (this.state.back) {
            return <Navigate to='/flights' />
        }

        return (
            <Container className="Margin-top font">
                <br />
                <Navigation  />
                <hr />
                <div className="w-100">
                        <div className="d-flex justify-content-center font">
                            <h3 className="text-center w-25 pozadina">Uredi let {this.state.naziv}</h3>
                        </div>
                        <form onSubmit={this.handleSubmit} className="w-100 container">
                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Naziv</label>
                                    <input type="text" required name="naziv" value={this.state.naziv} className="form-control" placeholder={this.state.naziv} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Vrijeme Polaska</label>
                                    <input type="datetime-local" required name="vrijemePolazak" value={this.state.vrijemePolazak} className="form-control" placeholder={this.state.vrijemePolazak} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Vrijeme dolaska</label>
                                    <input type="datetime-local" required min={this.state.vrijemePolazak}
                                        name="vrijemeDolazak" value={this.state.vrijemeDolazak} className="form-control" placeholder={this.state.vrijemeDolazak} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="row justify-content-md-center">
                                <div className="form-group">
                                    <label>Status</label>
                                    <input type="text" required name="status" value={this.state.status} className="form-control" placeholder={this.state.status} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="my-2 col-md-12 text-center">
                                <button type="submit" className="mx-2 col btn btn-primary btn-block btn-success mt-2">Uredi</button>
                                <button className="btn btn-danger btn-block mt-2" onClick={this.return}>Nazad</button>
                            </div>
                        </form>
                        {this.state.updateError &&
                            <div className="mt-3 mx-5"><Alert className="alert-dismissible" variant={'danger'}>{this.state.errorText} potrebno npr. "AA12345"</Alert></div>}
                </div>
            </Container>
        );
    }
}

export default EditFlightView;