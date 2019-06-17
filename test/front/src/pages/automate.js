import React from 'react'
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb'
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType'
import { MotionAnimations, MotionDurations } from '@uifabric/fluent-theme/lib/fluent/FluentMotion'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner'
import { Line } from 'react-chartjs-2'

import ParentPage from './_parentPage'
import Request from '../helpers/request'
import getRgba from '../helpers/colors'


export default class Automate extends ParentPage {
    constructor(props) {
        super(props)
        this.settings = {
            borderCapStyle: "butt",
            borderDashOffset: 0,
            borderJoinStyle: "miter",
            fill: false,
            lineTension: 0.1,
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHitRadius: 10,
            pointHoverBorderWidth: 2,
            pointHoverRadius: 5,
            pointRadius: 1,
        }
        this.state = {
            error: false,
            isLoading: true,
            refreshRate: 60, //Time to run another request to get more datas
            toWait: 60, //Time to wait before another request (has to be equal to this.state.refreshRate)
            unite: {},
            temps: {
                color: [getRgba(), getRgba()],
            },
            weight: {
                color: [getRgba(), getRgba()],
            },
            ph: {
                color: [getRgba()],
            },
            kplus: {
                color: [getRgba()],
            },
            nacl: {
                color: [getRgba()],
            },
            ppm: {
                color: [getRgba(), getRgba(), getRgba()],
            },
        }

        this.timeOut = null
        this.timeInterval = null
    }

    componentWillUnmount() {
        clearTimeout(this.timeOut)
        clearInterval(this.timeInterval)
    }

    componentDidMount() {
        this.load()
    }

    load() {
        Request.send('GET', ['data', this.props.match.params.unite, this.props.match.params.automate], {},
            data => {
                console.log(data)
                this.setState({
                    unite: data,
                    temps: {
                        ...this.state.temps,
                        // temp_cuve: data.map(x => { return x.TEMP_CUVE }).slice(-60),
                        // temp_ext: data.map(x => { return x.TEMP_EXT }).slice(-60)
                        temp_cuve: data.filter(x => x.DATETIME > new Date(Date.now() - 3600000).getTime()),
                        temp_ext: data.filter(x => x.DATETIME > new Date(Date.now() - 3600000).getTime())
                    },
                    weight: {
                        ...this.state.weight,
                        // temp_cuve: data.map(x => { return x.TEMP_CUVE }).slice(-60),
                        // temp_ext: data.map(x => { return x.TEMP_EXT }).slice(-60)
                        weight_milk: data.filter(x => x.DATETIME > new Date(Date.now() - 3600000).getTime()),
                        weight_product: data.filter(x => x.DATETIME > new Date(Date.now() - 3600000).getTime())
                    },
                    ph: {
                        ...this.state.ph,
                        // ph: data.map(x => { return x.PH }).slice(-60),
                        ph: data.filter(x => x.DATETIME > new Date(Date.now() - 3600000).getTime()),
                    },
                    kplus: {
                        ...this.state.kplus,
                        // kplus: data.map(x => { return x.K_PLUS }).slice(-60)
                        kplus: data.filter(x => x.DATETIME > new Date(Date.now() - 3600000).getTime()),
                    },
                    nacl: {
                        ...this.state.nacl,
                        // nacl: data.map(x => { return x.NACL }).slice(-60)
                        nacl: data.filter(x => x.DATETIME > new Date(Date.now() - 3600000).getTime()),
                    },
                    ppm: {
                        ...this.state.ppm,
                        // bacteria_salmonella: data.map(x => { return x.BACTERIA_SALMONELLA }).slice(-60),
                        // bacteria_ecoli: data.map(x => { return x.BACTERIA_ECOLI }).slice(-60),
                        // bacteria_listeria: data.map(x => { return x.BACTERIA_LISTERIA }).slice(-60)
                        bacteria_salmonella: data.filter(x => x.DATETIME > new Date(Date.now() - 3600000).getTime()),
                        bacteria_ecoli: data.filter(x => x.DATETIME > new Date(Date.now() - 3600000).getTime()),
                        bacteria_listeria: data.filter(x => x.DATETIME > new Date(Date.now() - 3600000).getTime())
                    },
                }, () => {
                    this.setState({
                        isLoading: false,
                        temps: {
                            ...this.state.temps,
                            data: {
                                datasets: [
                                    {
                                        ...this.settings,
                                        data: this.state.temps.temp_cuve.map(x => { return x.TEMP_CUVE }) || [],
                                        label: "Température cuve (C°)",
                                        borderColor: this.state.temps.color[0],
                                        pointBorderColor: this.state.temps.color[0],
                                        pointHoverBackgroundColor: this.state.temps.color[0],
                                    },
                                    {
                                        ...this.settings,
                                        data: this.state.temps.temp_ext.map(x => { return x.TEMP_EXT }) || [],
                                        label: "Température extérieure (C°)",
                                        borderColor: this.state.temps.color[1],
                                        pointBorderColor: this.state.temps.color[1],
                                        pointHoverBackgroundColor: this.state.temps.color[1],
                                    }
                                ],
                                labels: this.state.temps.temp_cuve.map(x => { return new Date(x.DATETIME).toLocaleTimeString('fr-FR') })
                            },
                        },
                        weight: {
                            ...this.state.weight,
                            data: {
                                datasets: [
                                    {
                                        ...this.settings,
                                        data: this.state.weight.weight_milk.map(x => { return x.WEIGHT_MILK }) || [],
                                        label: "Poids du lait en cuve (Kg)",
                                        borderColor: this.state.weight.color[0],
                                        pointBorderColor: this.state.weight.color[0],
                                        pointHoverBackgroundColor: this.state.weight.color[0],
                                    },
                                    {
                                        ...this.settings,
                                        data: this.state.weight.weight_product.map(x => { return x.WEIGTH_PRODUCT }) || [],
                                        label: "Poids du produit fini réalisé (Kg)",
                                        borderColor: this.state.weight.color[1],
                                        pointBorderColor: this.state.weight.color[1],
                                        pointHoverBackgroundColor: this.state.weight.color[1],
                                    }
                                ],
                                labels: this.state.weight.weight_milk.map(x => { return new Date(x.DATETIME).toLocaleTimeString('fr-FR') })
                            }
                        },
                        ph: {
                            ...this.state.ph,
                            data: {
                                datasets: [
                                    {
                                        ...this.settings,
                                        data: this.state.ph.ph.map(x => { return x.PH }) || [],
                                        label: "Mesure pH",
                                        borderColor: this.state.ph.color[0],
                                        pointBorderColor: this.state.ph.color[0],
                                        pointHoverBackgroundColor: this.state.ph.color[0],
                                    }
                                ],
                                labels: this.state.ph.ph.map(x => { return new Date(x.DATETIME).toLocaleTimeString('fr-FR') })
                            }
                        },
                        kplus: {
                            ...this.state.kplus,
                            data: {
                                datasets: [
                                    {
                                        ...this.settings,
                                        data: this.state.kplus.kplus.map(x => { return x.K_PLUS }) || [],
                                        label: "Mesure K+",
                                        borderColor: this.state.kplus.color[0],
                                        pointBorderColor: this.state.kplus.color[0],
                                        pointHoverBackgroundColor: this.state.kplus.color[0],
                                    }
                                ],
                                labels: this.state.kplus.kplus.map(x => { return new Date(x.DATETIME).toLocaleTimeString('fr-FR') })
                            }
                        },
                        nacl: {
                            ...this.state.nacl,
                            data: {
                                datasets: [
                                    {
                                        ...this.settings,
                                        data: this.state.nacl.nacl.map(x => { return x.NACL }) || [],
                                        label: "Concentration de NaCl",
                                        borderColor: this.state.nacl.color[0],
                                        pointBorderColor: this.state.nacl.color[0],
                                        pointHoverBackgroundColor: this.state.nacl.color[0],
                                    }
                                ],
                                labels: this.state.nacl.nacl.map(x => { return new Date(x.DATETIME).toLocaleTimeString('fr-FR') })
                            }
                        },
                        ppm: {
                            ...this.state.ppm,
                            data: {
                                datasets: [
                                    {
                                        ...this.settings,
                                        data: this.state.ppm.bacteria_salmonella.map(x => { return x.BACTERIA_SALMONELLA }) || [],
                                        label: "Niveau bactérien salmonelle (ppm)",
                                        borderColor: this.state.ppm.color[0],
                                        pointBorderColor: this.state.ppm.color[0],
                                        pointHoverBackgroundColor: this.state.ppm.color[0],
                                    },
                                    {
                                        ...this.settings,
                                        data: this.state.ppm.bacteria_ecoli.map(x => { return x.BACTERIA_ECOLI }) || [],
                                        label: "Niveau bactérien E-coli (ppm)",
                                        borderColor: this.state.ppm.color[1],
                                        pointBorderColor: this.state.ppm.color[1],
                                        pointHoverBackgroundColor: this.state.ppm.color[1],
                                    },
                                    {
                                        ...this.settings,
                                        data: this.state.ppm.bacteria_listeria.map(x => { return x.BACTERIA_LISTERIA }) || [],
                                        label: "Niveau bactérien Listéria (ppm)",
                                        borderColor: this.state.ppm.color[2],
                                        pointBorderColor: this.state.ppm.color[2],
                                        pointHoverBackgroundColor: this.state.ppm.color[2],
                                    }
                                ],
                                labels: this.state.ppm.bacteria_salmonella.map(x => { return new Date(x.DATETIME).toLocaleTimeString('fr-FR') })
                            }
                        },

                    })
                })
            },
            err => {
                this.setState({ error: true, isLoading: false })
                console.error(err)
            }
        ).always(() => {
            this.timeOut = setTimeout(
                () => {
                    clearInterval(this.timeInterval)
                    this.setState({ toWait: 0 })
                    this.load()
                }, this.state.refreshRate * 1000)
            this.timeInterval = setInterval(
                () => {                    
                    if (this.state.toWait === 0) {
                        this.setState({ toWait: this.state.refreshRate - 1 })
                    } else {
                        this.setState({ toWait: this.state.toWait - 1 })
                    }
                }, 1000)
        })
    }

    render() {
        return (
            <section>
                <Breadcrumb
                    items={[
                        { text: 'Accueil', key: 'home', onClick: () => this.props.history.push({ pathname: "/" }) },
                        { text: 'Unité n°' + this.props.match.params.unite, key: 'unite', onClick: () => this.props.history.push({ pathname: "/" + this.props.match.params.unite }) },
                        { text: 'Automate n°' + this.props.match.params.automate, key: 'automate', isCurrentItem: true }
                    ]}
                />
                {
                    this.state.error ?
                        <div>
                            <br />
                            <MessageBar
                                messageBarType={MessageBarType.error}
                                isMultiline={false}
                                onDismiss={() => this.setState({ error: false })}
                                dismissButtonAriaLabel="Close"
                            >
                                Une erreur est survenue
                            </MessageBar>
                            <br />
                        </div>
                        :
                        null
                }

                <div className="sub-container">
                    <p style={{ fontSize: FontSizes.size20 }}>Temps avant prochain rechargement : {this.state.toWait} secondes</p>

                    {
                        this.state.isLoading ?
                            <Spinner size={SpinnerSize.large} style={{ transform: 'scale3d(2.5,2.5,1)', marginTop: '100px' }} />
                            :
                            (
                                !this.state.error
                                    ?
                                    <div style={{ animation: MotionAnimations.fadeIn, animationDuration: MotionDurations.duration4 }}>

                                        <p style={{ fontSize: FontSizes.size28 }}>Les températures</p>
                                        {
                                            this.state.temps.temp_cuve.length && this.state.temps.temp_ext.length
                                                ?
                                                <Line data={this.state.temps.data} width={600} />
                                                :
                                                <p>Aucune donnée n'a été trouvée</p>
                                        }
                                        <br /><br />

                                        <p style={{ fontSize: FontSizes.size28 }}>Les poids</p>
                                        {
                                            this.state.weight.weight_milk.length && this.state.weight.weight_product.length
                                                ?
                                                <Line data={this.state.weight.data} width={600} />
                                                :
                                                <p>Aucune donnée n'a été trouvée</p>
                                        }
                                        <br /><br />

                                        <p style={{ fontSize: FontSizes.size28 }}>Le Ph</p>
                                        {
                                            this.state.ph.ph.length && this.state.ph.ph.length
                                                ?
                                                <Line data={this.state.ph.data} width={600} />
                                                :
                                                <p>Aucune donnée n'a été trouvée</p>
                                        }
                                        <br /><br />

                                        <p style={{ fontSize: FontSizes.size28 }}>Le K+</p>
                                        {
                                            this.state.kplus.kplus.length && this.state.kplus.kplus.length
                                                ?
                                                <Line data={this.state.kplus.data} width={600} />
                                                :
                                                <p>Aucune donnée n'a été trouvée</p>
                                        }
                                        <br /><br />

                                        <p style={{ fontSize: FontSizes.size28 }}>Le NaCl</p>
                                        {
                                            this.state.nacl.nacl.length && this.state.nacl.nacl.length
                                                ?
                                                <Line data={this.state.nacl.data} width={600} />
                                                :
                                                <p>Aucune donnée n'a été trouvée</p>
                                        }
                                        <br />  <br />

                                        <p style={{ fontSize: FontSizes.size28 }}>Les ppm</p>
                                        {
                                            this.state.ppm.bacteria_salmonella.length && this.state.ppm.bacteria_ecoli.length && this.state.ppm.bacteria_listeria.length
                                                ?
                                                <Line data={this.state.ppm.data} width={600} />
                                                :
                                                <p>Aucune donnée n'a été trouvée</p>
                                        }
                                        <br />  <br />
                                    </div>
                                    :
                                    null
                            )

                    }

                </div>

            </section>
        )
    }
}
