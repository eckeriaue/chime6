defmodule SignalServerWeb.PageController do
  use SignalServerWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
