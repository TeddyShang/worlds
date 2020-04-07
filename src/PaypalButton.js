import React from 'react';
import ReactDOM from 'react-dom';
import PaypalExpressBtn from 'react-paypal-express-checkout';

//https://github.com/thinhvo0108/react-paypal-express-checkout


const client = {
    sandbox:    'ASe_CikaEqXa0UeNWeBWuRI9jvIkmK5KXQEaoHO-7SwnWZuscSXg99kzzWpYalatdlYx2tos6K41T8fJ',
    production: 'YOUR-PRODUCTION-APP-ID',
}

class PaypalButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            order_total: 0,
            env : 'sandbox',
            currency : 'USD'
        }
        this.onSuccess = this.onSuccess.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onError = this.onError.bind(this);
    }

    onSuccess = (payment) => {
        this.props.payment_successful();

    }

    onCancel = (data) => {
        this.props.payment_cancelled();

    }

    onError = (err) => {
        this.props.payment_errored();

    }

    componentDidMount(){
        var order_total = this.props.order_total;
        this.setState({
            order_total: order_total
        });
    }


    render() {
        return(
        <PaypalExpressBtn env={this.state.env} client={client} currency={this.state.currency} total={this.state.order_total} onError={this.onError} onSuccess={this.onSuccess} onCancel={this.onCancel} />
        )
    }

}
export default PaypalButton;