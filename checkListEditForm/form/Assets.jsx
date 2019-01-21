import React, { Component } from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { connect } from 'react-redux';

import ShadowBlock from 'components/ShadowBlock';
import { COLORS } from 'components/theme';
import ListField from 'components/ListField/ListField';
import {
    makeGetNormalizedAssets,
    getAssetsActionCreator,
    getAssetsLoadingFlag,
} from 'modules/checkListEditForm/assets';

const MainRoot = styled(ShadowBlock)({
    flexDirection: 'column',
    padding: '28px 22px',
    marginBottom: 20,
    background: COLORS.COMMON.WHITE,
});

class Assets extends Component {
    getRootAssets = () => {
        const { getAssetsActionCreator } = this.props;
        const params = {
            parentID: -1,
            isDeleted: false,
            includePath: true,
        };
        getAssetsActionCreator(params);
    };

    getChildAssets = parentAsset => {
        const { getAssetsActionCreator } = this.props;
        const params = {
            parentID: parentAsset.id || -1,
            isDeleted: false,
            includePath: true,
        };
        getAssetsActionCreator(params);
    };

    render() {
        const { t, assets, assetsIsLoading } = this.props;
        return (
            <MainRoot>
                <Field
                    component={ListField}
                    name="checkListAssets"
                    items={assets}
                    onListItemClick={this.getChildAssets}
                    itemsLoading={assetsIsLoading}
                    label={t('checkListAssets')}
                    labelKey="name"
                    hint={t('addCheckListAssetsHint')}
                    multiple
                    flexible
                    onOpen={this.getRootAssets}
                />
            </MainRoot>
        );
    }
}

Assets.propTypes = {
    t: PropTypes.func,
    assets: PropTypes.array,
    getAssetsActionCreator: PropTypes.func,
    assetsIsLoading: PropTypes.bool,
};

const makeMapStateToProps = () => {
    const getAssets = makeGetNormalizedAssets();
    const mapStateToProps = (state, props) => ({
        assets: getAssets(state, props),
        assetsIsLoading: getAssetsLoadingFlag(state),
    });
    return mapStateToProps;
};

const mapDispatchToProps = {
    getAssetsActionCreator,
};

const AssetsWithConnect = connect(makeMapStateToProps, mapDispatchToProps)(Assets);

export default AssetsWithConnect;
