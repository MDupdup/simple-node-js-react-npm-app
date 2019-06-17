import React, { Component } from 'react';
import '../App.css';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import { FontSizes } from '@uifabric/fluent-theme/lib/fluent/FluentType'


export default class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nav: [
                {
                    key: 'newItem',
                    name: 'New',
                    cacheKey: 'myCacheKey', // changing this key will invalidate this items cache          
                    iconProps: {
                        iconName: 'Add'
                    },
                    ariaLabel: 'New',
                    subMenuProps: {
                        items: [
                            {
                                key: 'emailMessage',
                                name: 'Email message',
                                iconProps: {
                                    iconName: 'Mail'
                                }
                            },
                            {
                                key: 'calendarEvent',
                                name: 'Calendar event',
                                iconProps: {
                                    iconName: 'Calendar'
                                }
                            }
                        ]
                    }
                },
                {
                    key: 'upload',
                    name: 'Upload',
                    iconProps: {
                        iconName: 'Upload'
                    },
                    onClick: () => console.log('Upload')
                },
                {
                    key: 'share',
                    name: 'Share',
                    iconProps: {
                        iconName: 'Share'
                    },
                    onClick: () => console.log('Share')
                },
                {
                    key: 'download',
                    name: 'Download',
                    iconProps: {
                        iconName: 'Download'
                    },
                    onClick: () => console.log('Download')
                }
            ]
        }
    }

    render() {
        return (
            <header>
                <div style={{ backgroundColor: 'black', padding: '10px 20px' }}>
                    <p style={{ margin: 0, color: 'white', fontSize: FontSizes.size18 }}>Au bon beurre - IHM</p>
                </div>
                <CommandBar
                    items={this.state.nav}
                />
            </header>
        )
    }
}
