// @flow
import i18n from '@dhis2/d2-i18n';
import React from 'react';
import moment from 'moment';
import type { ComponentType, Element } from 'react';
import { Avatar, Grid, withStyles } from '@material-ui/core';
import { colors, Tag } from '@dhis2/ui-core';
import { DataElement } from '../../metaData';
import type { SearchResultItem } from '../Pages/Search/SearchResults/SearchResults.types';
import type { DataElementsInformation } from '../Pages/Search/SearchResults/SearchResults.component';

type OwnProps = $ReadOnly<{|
    item: SearchResultItem,
    // todo
    isEnrolled?: boolean,
    getCustomTopElements?: ?(props: Object) => Element<any>,
    getCustomBottomElements?: ?(props: Object) => Element<any>,
    imageDataElement: DataElement,
    dataElements: DataElementsInformation,
|}>;

const getStyles = (theme: Theme) => ({
    itemContainer: {
        width: theme.typography.pxToRem(600),
        display: 'flex',
        flexDirection: 'column',
        margin: theme.typography.pxToRem(8),
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(4),
        border: `2px solid ${theme.palette.grey.light}`,
        backgroundColor: theme.palette.grey.lighter,
    },
    itemDataContainer: {
        display: 'flex',
    },
    lastUpdated: {
        fontSize: theme.typography.pxToRem(12),
        color: colors.grey700,
        paddingBottom: theme.typography.pxToRem(8),
    },
    enrolled: {
        display: 'flex',
        justifyContent: 'flex-end',
        color: colors.grey700,
    },
    elementName: {
        fontSize: theme.typography.pxToRem(13),
        color: colors.grey700,

    },
    elementValue: {
        fontSize: theme.typography.pxToRem(14),
        color: colors.grey900,
        fontWeight: 500,
    },
    itemValuesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
    },
    value: {
        paddingBottom: theme.typography.pxToRem(4),
    },
    image: {
        width: theme.typography.pxToRem(44),
        height: theme.typography.pxToRem(44),
    },
    imageContainer: {
        marginRight: theme.typography.pxToRem(8),
    },
});

const Index = (props: OwnProps & CssClasses) => {
    const renderImageDataElement = (imageDataElement: DataElement) => {
        const { item, classes } = props;
        const imageValue = item.values[imageDataElement.id];
        return (
            <div className={classes.imageContainer}>
                {imageValue && <Avatar src={imageValue.url} alt={imageValue.name} className={classes.image} />}
            </div>
        );
    };

    const {
        item,
        classes,
        imageDataElement,
        getCustomTopElements,
        getCustomBottomElements,
        isEnrolled,
        dataElements,
    } = props;

    return (
        <div data-test="dhis2-capture-card-list-item" className={classes.itemContainer}>
            {getCustomTopElements && getCustomTopElements(props)}
            <div className={classes.itemDataContainer}>

                <div className={classes.itemValuesContainer}>
                    <Grid container spacing={2}>
                        {
                            imageDataElement &&
                            <Grid item>
                                {renderImageDataElement(imageDataElement)}
                            </Grid>
                        }
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                {
                                    dataElements.map(element => (
                                        <Grid item xs>
                                            <div key={element.id} className={classes.value}>
                                                <span className={classes.elementName}>
                                                    {element.name}:&nbsp;
                                                </span>
                                                <span className={classes.elementValue}>
                                                    {item.values[element.id]}
                                                </span>
                                            </div>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                            <Grid item>
                                {
                                    item.tei && item.tei.lastUpdated &&
                                    <div className={classes.lastUpdated}>
                                        Last updated {moment(item.tei.lastUpdated).fromNow()}
                                    </div>
                                }
                                <div className={classes.enrolled}>
                                    {
                                        isEnrolled ?
                                            <Tag dataTest="dhis2-uicore-tag" positive>
                                                { i18n.t('Enrolled') }
                                            </Tag>
                                            :
                                            <Tag dataTest="dhis2-uicore-tag">
                                                { i18n.t('Not Enrolled') }
                                            </Tag>

                                    }
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>

            {getCustomBottomElements && getCustomBottomElements(props)}
        </div>
    );
};

Index.defaultProps = {
    isEnrolled: true,
};

export const CardListItem: ComponentType<OwnProps> = withStyles(getStyles)(Index);
