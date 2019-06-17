import React from 'react'
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { DetailsListLayoutMode, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList'
import { ShimmeredDetailsList } from 'office-ui-fabric-react/lib/ShimmeredDetailsList'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'

import Request from '../helpers/request'
import ParentPage from './_parentPage'


export default class Unite extends ParentPage {
    constructor(props) {
        super(props)

        this.state = {
            error: false,
            automates: [],
            isLoading: true,
            columns: [
                {
                    key: 'automate',
                    name: 'Automates',
                    fieldName: 'NUM_AUTOMATE',
                    minWidth: 75,
                    maxWidth: 450,
                    isRowHeader: true,
                    isResizable: true,
                    isSorted: true,
                    isSortedDescending: false,
                    sortAscendingAriaLabel: 'Sorted A to Z',
                    sortDescendingAriaLabel: 'Sorted Z to A',
                    onColumnClick: this._onColumnClick.bind(this, { colName: "columns", dataName: ['automates'] }),
                    data: 'string',
                    isPadded: true,
                    onRender: (item) => {
                        return <Link key={item} onClick={() => this.props.history.push({ pathname: "/" + this.props.match.params.unite + "/" + item.NUM_AUTOMATE })}>Détail de l'automate : {item.NUM_AUTOMATE}</Link >
                    }
                },
                {
                    key: 'TOTAL',
                    name: 'Total',
                    fieldName: 'TOTAL',
                    minWidth: 75,
                    maxWidth: 450,
                    isRowHeader: true,
                    isResizable: true,
                    isSorted: false,
                    isSortedDescending: false,
                    sortAscendingAriaLabel: 'Sorted A to Z',
                    sortDescendingAriaLabel: 'Sorted Z to A',
                    onColumnClick: this._onColumnClick.bind(this, { colName: "columns", dataName: ['automates'] }),
                    data: 'string',
                    isPadded: true
                }
            ],

        }
    }

    componentDidMount() {
        Request.send('GET', ['data', this.props.match.params.unite], {},
            data => {
                this.setState({
                    automates: data,
                    isLoading: false
                })
            },
            err => {
                this.setState({ error: true, isLoading: false })
                console.error(err)
            }
        )
    }

    render() {
        return (
            <section>
                <Breadcrumb
                    items={[
                        { text: 'Accueil', key: 'home', onClick: () => this.props.history.push({ pathname: "/" }) },
                        { text: 'Unité n°' + this.props.match.params.unite, key: 'unite', isCurrentItem: true },
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

                <br />

                <ShimmeredDetailsList
                    items={this.state.automates}
                    compact={false}
                    columns={this.state.columns}
                    selectionMode={false ? SelectionMode.multiple : SelectionMode.none}
                    setKey="set"
                    layoutMode={DetailsListLayoutMode.justified}
                    isHeaderVisible={true}
                    enableShimmer={this.state.isLoading}
                    listProps={{ renderedWindowsAhead: 0, renderedWindowsBehind: 0 }}
                />

            </section>
        )
    }
}
