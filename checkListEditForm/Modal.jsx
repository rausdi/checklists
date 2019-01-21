import React, { Fragment } from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';

import Text from 'components/Text';
import Button from 'components/Button';

const Title = styled(Text)({
    textAlign: 'center',
});

const Body = styled.div({
    display: 'flex',
    flexDirection: 'column',
    padding: '0 35px 35px 35px',
});

const Buttons = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 32,
});

function Modal(props) {
    const { t, onConfirm, onClose, confirmButtonLoading } = props;
    return (
        <Fragment>
            <Body>
                <Title>{t('checkListDeleteWarning')}</Title>
                <Buttons>
                    <Button text={t('common:cancel')} onClick={onClose} />
                    <Button
                        text={t('common:delete')}
                        type={'primary'}
                        onClick={onConfirm}
                        loading={confirmButtonLoading}
                    />
                </Buttons>
            </Body>
        </Fragment>
    );
}

Modal.propTypes = {
    t: PropTypes.func,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    confirmButtonLoading: PropTypes.bool,
};

export default Modal;
