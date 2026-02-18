"use client";

import { useState, FormEvent } from "react";
import Button from "@/components/ui/Button";

/**
 * Composant ContactForm - Formulaire de contact et de prise de rendez-vous
 * Inclut la validation côté client et la gestion des états
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motif: "",
    message: "",
    datePreferee: "",
    heurePreferee: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Gestion des changements dans les champs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      // Simulation d'envoi - à remplacer par votre API réelle
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulation d'un délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Succès
      setStatus("success");
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        motif: "",
        message: "",
        datePreferee: "",
        heurePreferee: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom et Prénom */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Nom <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            required
            value={formData.nom}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label
            htmlFor="prenom"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Prénom <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            required
            value={formData.prenom}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="Votre prénom"
          />
        </div>
      </div>

      {/* Email et Téléphone */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="telephone"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Téléphone <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            required
            value={formData.telephone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      {/* Motif de consultation */}
      <div>
        <label
          htmlFor="motif"
          className="block text-sm font-medium text-secondary-700 mb-2"
        >
          Motif de consultation <span className="text-red-600">*</span>
        </label>
        <select
          id="motif"
          name="motif"
          required
          value={formData.motif}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        >
          <option value="">Sélectionnez un motif</option>
          <option value="consultation">Consultation générale</option>
          <option value="urgence">Urgence dentaire</option>
          <option value="detartrage">Détartrage</option>
          <option value="implant">Implant dentaire</option>
          <option value="orthodontie">Orthodontie</option>
          <option value="esthetique">Dentisterie esthétique</option>
          <option value="enfant">Consultation enfant</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      {/* Date et heure préférées */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="datePreferee"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Date préférée
          </label>
          <input
            type="date"
            id="datePreferee"
            name="datePreferee"
            value={formData.datePreferee}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="heurePreferee"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Plage horaire préférée
          </label>
          <select
            id="heurePreferee"
            name="heurePreferee"
            value={formData.heurePreferee}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">Indifférent</option>
            <option value="matin">Matin (9h-12h)</option>
            <option value="apres-midi">Après-midi (14h-18h)</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-secondary-700 mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
          placeholder="Décrivez brièvement votre demande ou vos symptômes..."
        />
      </div>

      {/* Messages de statut */}
      {status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">
              Votre demande a été envoyée avec succès ! Nous vous recontacterons
              dans les plus brefs délais.
            </span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Bouton de soumission */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-600">
          <span className="text-red-600">*</span> Champs obligatoires
        </p>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Envoi en cours...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Envoyer la demande
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
