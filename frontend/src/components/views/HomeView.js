import React from "react";
import '../../styles/index.css'
import { Table, Button, Container } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { URL } from '../shared/Constants'
import Navigation from '../shared/Navigation'

class HomeView extends React.Component {
    constructor() {
        super();
        this.state = {
            lines: [],
            flights: [],
            toPassengersForm: false,
            toAddingForm: false,
            toEditingForm: false
        }
        this.getLines = this.getLines.bind(this)
        this.handlePage = this.handlePage.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleFlights = this.handleFlights.bind(this)
        this.addLine = this.addLine.bind(this)
    }

    componentDidMount() {
        this.getLines();
    }

    getLines() {
        axios.get(URL + '/getLines')
            .then(response => {
                console.log(response.data)
                this.setState({
                    lines: response.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    
    handlePage() {
        this.setState({
            toPassengersForm: true,
        });
    }

    handleFlights(linija) {
        localStorage.setItem('linija', JSON.stringify(linija))
        this.setState({
            showFlights: true,
        });
    }

    handleEdit(linija) {
        localStorage.setItem('linija', JSON.stringify(linija))
        this.setState({
            toEditingForm: true,
        });
    }

    addLine() {
        this.setState({
            toAddingForm: true,
        });
    }

    handleDelete(line){
        console.log(line)
        let updatedLines = this.state.lines
        console.log(updatedLines)

        if(!updatedLines.includes(line)){
            updatedLines.push(line)
        }else{
            updatedLines = updatedLines.filter(x => x !== line)
        }
        
        this.setState({
            lines: updatedLines
        },() => {
          //console.log(this.state.lines);
        })

        let data = {
            idLinije: line.idLinije
        }
        axios.post(URL + '/deleteLineById', data)
            .then(response => {
                console.log(response.status)

            })
            .catch((error) => {
                console.log(error)
        })
    }

    render() {
        if (this.state.toPassengersForm) {
            return (
                <Navigate to='/passengers' />
            )
        }

        if (this.state.toEditingForm) {
            return (
                <Navigate to='/editLine' />
            )
        }

        if (this.state.toAddingForm) {
            return (
                <Navigate to='/addLine' />
            )
        }

        if (this.state.showFlights) {
            return (
                <Navigate to='/flights' />
            )
        }

        const lines = this.state.lines
        let i = 0
        const listLines = lines.map(line =>
            <tr key={i++}>
                <td>{line.naziv}</td>
                <td>{line.zracnaLukaPolaska}</td>
                <td>{line.zracnaLukaDolaska}</td>
                <td>{line.kompanija}</td>
                <td><Button variant="primary" className="inline- text-white" value={line.idLinije} onClick={() => this.handleEdit(line)}>Edit</Button></td>
                <td><Button variant="danger" className="inline- text-white" value={line.idLinije} onClick={() => this.handleDelete(line)}>Delete</Button></td>
                <td><Button variant="info" className="inline- text-white" value={line.idLinije} onClick={() => this.handleFlights(line)}>Letovi</Button></td>
            </tr>
        )

        return (
            <Container className="Margin-top font">
                <br />
                <Navigation  />
                <hr />
                <h3 className="text-center font">Linije</h3>
                <Table className="table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Naziv</th>
                            <th>Zračna Luka Polaska</th>
                            <th>Zračna Luka Dolaska</th>
                            <th>Kompanija</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listLines}
                    </tbody>
                </Table>
                <Button variant="primary" className="inline- text-white" onClick={() => this.addLine()}>Add new +</Button>
            </Container>
        )
    }
}

export default HomeView;